import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateQueueInsights } from "@/lib/openai"

export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { queueId } = await request.json()

    // Get queue data
    const queue = await prisma.queue.findUnique({
      where: { id: queueId },
      include: {
        entries: {
          where: { status: "WAITING" },
        },
        _count: {
          select: { entries: { where: { status: "WAITING" } } },
        },
      },
    })

    if (!queue || queue.ownerId !== user.id) {
      return NextResponse.json({ error: "Queue not found or unauthorized" }, { status: 404 })
    }

    // Get analytics data
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [totalServed, abandonmentData, dailyTraffic] = await Promise.all([
      prisma.queueEntry.count({
        where: {
          queueId,
          status: "SERVED",
          servedAt: { gte: weekAgo },
        },
      }),
      prisma.queueEntry.groupBy({
        by: ["status"],
        where: {
          queueId,
          joinedAt: { gte: weekAgo },
        },
        _count: true,
      }),
      prisma.$queryRaw`
        SELECT 
          DATE(joined_at) as date,
          COUNT(*) as count
        FROM queue_entries 
        WHERE queue_id = ${queueId} 
          AND joined_at >= ${weekAgo}
        GROUP BY DATE(joined_at)
        ORDER BY date
      `,
    ])

    const totalEntries = abandonmentData.reduce((sum, group) => sum + group._count, 0)
    const leftEntries = abandonmentData.find((group) => group.status === "LEFT")?._count || 0
    const abandonmentRate = totalEntries > 0 ? ((leftEntries / totalEntries) * 100).toFixed(1) + "%" : "0%"

    const queueData = {
      name: queue.name,
      location: queue.location,
      category: queue.category,
      peopleInQueue: queue._count.entries,
      waitTime: `${Math.max(queue._count.entries * 2, 5)} min`,
    }

    const analyticsData = {
      totalServed,
      abandonmentRate,
      dailyTraffic,
    }

    const insights = await generateQueueInsights(queueData, analyticsData)

    return NextResponse.json({ insights })
  } catch (error) {
    console.error("Error generating AI insights:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}
