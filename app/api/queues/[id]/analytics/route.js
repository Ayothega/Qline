import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "7d"

    // Check if user owns the queue
    const queue = await prisma.queue.findUnique({
      where: { id },
      select: { ownerId: true },
    })

    if (!queue || queue.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Calculate date range
    const now = new Date()
    const startDate = new Date()

    switch (timeRange) {
      case "24h":
        startDate.setHours(now.getHours() - 24)
        break
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
    }

    // Get analytics data
    const [totalServed, avgWaitTime, abandonmentRate, dailyTraffic] = await Promise.all([
      // Total served
      prisma.queueEntry.count({
        where: {
          queueId: id,
          status: "SERVED",
          servedAt: { gte: startDate },
        },
      }),

      // Average wait time
      prisma.queueEntry.aggregate({
        where: {
          queueId: id,
          status: "SERVED",
          servedAt: { gte: startDate },
        },
        _avg: {
          position: true,
        },
      }),

      // Abandonment rate
      prisma.queueEntry.groupBy({
        by: ["status"],
        where: {
          queueId: id,
          joinedAt: { gte: startDate },
        },
        _count: true,
      }),

      // Daily traffic
      prisma.$queryRaw`
        SELECT 
          DATE(joined_at) as date,
          COUNT(*) as count
        FROM queue_entries 
        WHERE queue_id = ${id} 
          AND joined_at >= ${startDate}
        GROUP BY DATE(joined_at)
        ORDER BY date
      `,
    ])

    // Calculate metrics
    const avgWaitTimeMinutes = Math.round((avgWaitTime._avg.position || 0) * 2)

    const totalEntries = abandonmentRate.reduce((sum, group) => sum + group._count, 0)
    const leftEntries = abandonmentRate.find((group) => group.status === "LEFT")?._count || 0
    const abandonmentPercentage = totalEntries > 0 ? ((leftEntries / totalEntries) * 100).toFixed(1) : 0

    return NextResponse.json({
      totalServed,
      avgWaitTime: `${avgWaitTimeMinutes} min`,
      abandonmentRate: `${abandonmentPercentage}%`,
      dailyTraffic: dailyTraffic.map((day) => ({
        date: day.date,
        count: Number(day.count),
      })),
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
