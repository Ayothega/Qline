import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { triggerQueueUpdate, triggerPositionUpdate } from "@/lib/pusher"
import { NotificationService } from "@/lib/notifications"

export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, entryId } = await params
    const body = await request.json()
    const { action } = body // 'serve' or 'skip'

    // Check if user owns the queue
    const queue = await prisma.queue.findUnique({
      where: { id },
      select: { ownerId: true },
    })

    if (!queue || queue.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const entry = await prisma.queueEntry.findUnique({
      where: { id: entryId },
    })

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    if (action === "serve") {
      // Mark as served
      await prisma.queueEntry.update({
        where: { id: entryId },
        data: {
          status: "SERVED",
          servedAt: new Date(),
        },
      })

      // Update positions of remaining entries
      await prisma.queueEntry.updateMany({
        where: {
          queueId: id,
          status: "WAITING",
          position: { gt: entry.position },
        },
        data: {
          position: { decrement: 1 },
        },
      })
    } else if (action === "skip") {
      // Move to end of queue
      const lastEntry = await prisma.queueEntry.findFirst({
        where: {
          queueId: id,
          status: "WAITING",
        },
        orderBy: { position: "desc" },
      })

      const newPosition = (lastEntry?.position || 0) + 1

      await prisma.queueEntry.update({
        where: { id: entryId },
        data: { position: newPosition },
      })

      // Update positions of entries that were after this one
      await prisma.queueEntry.updateMany({
        where: {
          queueId: id,
          status: "WAITING",
          position: { gt: entry.position },
          id: { not: entryId },
        },
        data: {
          position: { decrement: 1 },
        },
      })
    }

    // Get updated queue data
    const updatedQueue = await prisma.queue.findUnique({
      where: { id },
      include: {
        entries: {
          where: { status: "WAITING" },
          orderBy: { position: "asc" },
        },
        _count: {
          select: { entries: { where: { status: "WAITING" } } },
        },
      },
    })

    // Send notifications for queue updates
    try {
      if (action === "serve") {
        // Get the entry that's being served
        const servedEntry = await prisma.queueEntry.findUnique({
          where: { id: entryId },
          include: { queue: true, userData: true },
        })

        if (servedEntry && servedEntry.userData) {
          await NotificationService.sendYourTurnNotifications(servedEntry, servedEntry.queue, servedEntry.userData)
        }
      }

      // Send position update notifications to affected users
      const affectedEntries = await prisma.queueEntry.findMany({
        where: {
          queueId: id,
          status: "WAITING",
          position: { lte: 5 }, // Only notify top 5 positions
        },
        include: { queue: true, userData: true },
      })

      for (const entry of affectedEntries) {
        if (entry.userData) {
          if (entry.position === 1) {
            // Next person is now #1 - send "your turn" notification
            await NotificationService.sendYourTurnNotifications(entry, entry.queue, entry.userData)
          } else if (entry.position <= 3) {
            // Send position alert for top 3
            await NotificationService.sendPositionAlertNotifications(entry, entry.queue, entry.userData)
          } else {
            // Send regular update for positions 4-5
            await NotificationService.sendQueueUpdateNotifications(entry, entry.queue, entry.userData, "Queue Updated")
          }
        }
      }
    } catch (error) {
      console.error("Failed to send queue update notifications:", error)
      // Don't fail the request if notifications fail
    }

    // Trigger real-time updates via Pusher
    await triggerQueueUpdate(id, {
      peopleInQueue: updatedQueue._count.entries,
      waitTime: `${Math.max(updatedQueue._count.entries * 2, 5)} min`,
    })

    // Trigger position updates to all waiting users
    const positionUpdates = updatedQueue.entries.map((entry, index) => ({
      userId: entry.userId,
      position: index + 1,
      waitTime: `${(index + 1) * 2} min`,
    }))

    await triggerPositionUpdate(id, {
      updates: positionUpdates,
    })

    return NextResponse.json({ message: "Entry updated successfully" })
  } catch (error) {
    console.error("Error updating queue entry:", error)
    return NextResponse.json({ error: "Failed to update queue entry" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, entryId } = await params

    // Check if user owns the queue or is the entry owner
    const entry = await prisma.queueEntry.findUnique({
      where: { id: entryId },
      include: {
        queue: {
          select: { ownerId: true },
        },
      },
    })

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    const canDelete = entry.queue.ownerId === user.id || entry.userId === user.id

    if (!canDelete) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Mark as left
    await prisma.queueEntry.update({
      where: { id: entryId },
      data: { status: "LEFT" },
    })

    // Update positions of remaining entries
    await prisma.queueEntry.updateMany({
      where: {
        queueId: id,
        status: "WAITING",
        position: { gt: entry.position },
      },
      data: {
        position: { decrement: 1 },
      },
    })

    // Get updated queue data and trigger real-time updates
    const updatedQueue = await prisma.queue.findUnique({
      where: { id },
      include: {
        entries: {
          where: { status: "WAITING" },
          orderBy: { position: "asc" },
        },
        _count: {
          select: { entries: { where: { status: "WAITING" } } },
        },
      },
    })

    // Trigger real-time updates via Pusher
    await triggerQueueUpdate(id, {
      peopleInQueue: updatedQueue._count.entries,
      waitTime: `${Math.max(updatedQueue._count.entries * 2, 5)} min`,
    })

    // Trigger position updates to all waiting users
    const positionUpdates = updatedQueue.entries.map((entry, index) => ({
      userId: entry.userId,
      position: index + 1,
      waitTime: `${(index + 1) * 2} min`,
    }))

    await triggerPositionUpdate(id, {
      updates: positionUpdates,
    })

    return NextResponse.json({ message: "Left queue successfully" })
  } catch (error) {
    console.error("Error leaving queue:", error)
    return NextResponse.json({ error: "Failed to leave queue" }, { status: 500 })
  }
}
