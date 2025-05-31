import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { predictWaitTime } from "@/lib/openai"

export async function POST(request) {
  try {
    const { queueId } = await request.json()

    const queue = await prisma.queue.findUnique({
      where: { id: queueId },
      include: {
        _count: {
          select: { entries: { where: { status: "WAITING" } } },
        },
      },
    })

    if (!queue) {
      return NextResponse.json({ error: "Queue not found" }, { status: 404 })
    }

    const now = new Date()
    const timeOfDay = now.getHours()
    const dayOfWeek = now.toLocaleDateString("en-US", { weekday: "long" })

    const queueData = {
      peopleInQueue: queue._count.entries,
      category: queue.category,
      location: queue.location,
    }

    const prediction = await predictWaitTime(queueData, timeOfDay, dayOfWeek)

    return NextResponse.json({ prediction })
  } catch (error) {
    console.error("Error predicting wait time:", error)
    return NextResponse.json({ error: "Failed to predict wait time" }, { status: 500 })
  }
}
