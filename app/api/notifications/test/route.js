import { NextResponse } from "next/server"
import { NotificationService } from "@/lib/notifications"

export async function POST(request) {
  try {
    const body = await request.json()
    const { type, email, phone, name } = body

    let result = []

    switch (type) {
      case "welcome":
        result = await NotificationService.sendWelcomeNotifications({ name, email, phone })
        break

      case "queue-created":
        const mockQueue = { id: "test-123", name: "Test Queue" }
        const mockOwner = { name, email, phone }
        result = await NotificationService.sendQueueCreatedNotifications(mockQueue, mockOwner)
        break

      case "queue-joined":
        const mockEntry = { position: 3 }
        const mockQueueData = { name: "Test Queue", location: "Test Location" }
        const mockUserData = { name, email, phone }
        result = await NotificationService.sendQueueJoinedNotifications(mockEntry, mockQueueData, mockUserData)
        break

      case "your-turn":
        const turnEntry = { position: 1 }
        const turnQueue = { name: "Test Queue", location: "Test Location" }
        const turnUser = { name, email, phone }
        result = await NotificationService.sendYourTurnNotifications(turnEntry, turnQueue, turnUser)
        break

      case "queue-update":
        const updateEntry = { position: 2 }
        const updateQueue = { name: "Test Queue" }
        const updateUser = { name, email, phone }
        result = await NotificationService.sendQueueUpdateNotifications(updateEntry, updateQueue, updateUser)
        break

      default:
        return NextResponse.json({ error: "Invalid notification type" }, { status: 400 })
    }

    return NextResponse.json({
      message: `${type} notification sent successfully`,
      result,
    })
  } catch (error) {
    console.error("Error sending test notification:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
