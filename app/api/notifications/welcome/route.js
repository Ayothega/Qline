import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { NotificationService } from "@/lib/notifications"

export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { phone } = body

    // Create user data for notifications
    const userData = {
      name: user.name,
      email: user.email,
      phone: phone,
    }

    const notifications = await NotificationService.sendWelcomeNotifications(userData)

    return NextResponse.json({
      message: "Welcome notifications sent",
      notifications,
    })
  } catch (error) {
    console.error("Error sending welcome notifications:", error)
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 })
  }
}
