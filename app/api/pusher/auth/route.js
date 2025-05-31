import { NextResponse } from "next/server"
import { pusherServer } from "@/lib/pusher"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { socket_id, channel_name } = await request.json()

    // Authorize user for private channels
    if (channel_name.startsWith("private-admin-")) {
      const userId = channel_name.replace("private-admin-", "")
      if (userId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    const authResponse = pusherServer.authorizeChannel(socket_id, channel_name, {
      user_id: user.id,
      user_info: {
        name: user.name,
        email: user.email,
      },
    })

    return NextResponse.json(authResponse)
  } catch (error) {
    console.error("Pusher auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
