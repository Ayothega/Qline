import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { triggerQueueUpdate, triggerPositionUpdate } from "@/lib/pusher"
import { NotificationService } from "@/lib/notifications"

export async function POST(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const user = await getCurrentUser()

    // Check if queue exists and is active
    const queue = await prisma.queue.findUnique({
      where: { id },
      include: {
        entries: {
          where: { status: "WAITING" },
          orderBy: { position: "desc" },
          take: 1,
        },
      },
    })

    if (!queue || !queue.isActive) {
      return NextResponse.json({ error: "Queue not found or inactive" }, { status: 404 })
    }

    // Check if user is already in this queue
    if (user) {
      const existingEntry = await prisma.queueEntry.findFirst({
        where: {
          queueId: id,
          userId: user.id,
          status: "WAITING",
        },
      })

      if (existingEntry) {
        return NextResponse.json({ error: "Already in queue" }, { status: 400 })
      }
    }

    // Get next position
    const lastPosition = queue.entries[0]?.position || 0
    const nextPosition = lastPosition + 1

    // Create queue entry
    const entry = await prisma.queueEntry.create({
      data: {
        queueId: id,
        userId: user?.id,
        position: nextPosition,
        userData: body,
      },
    })

    // Send queue joined notifications
    try {
      await NotificationService.sendQueueJoinedNotifications(entry, queue, body)
    } catch (error) {
      console.error("Failed to send queue joined notifications:", error)
      // Don't fail the request if notifications fail
    }

    // Trigger real-time updates via Pusher
    await triggerQueueUpdate(id, {
      peopleInQueue: nextPosition,
      waitTime: `${nextPosition * 2} min`,
    })

    // Notify all users about the new person joining
    await triggerPositionUpdate(id, {
      newJoin: {
        position: nextPosition,
        name: body.name || "Anonymous",
      },
    })

    return NextResponse.json(
      {
        id: entry.id,
        position: entry.position,
        queueId: id,
        joinedAt: entry.joinedAt,
        estimatedWaitTime: `${nextPosition * 2} min`,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error joining queue:", error)
    return NextResponse.json({ error: "Failed to join queue" }, { status: 500 })
  }
}
