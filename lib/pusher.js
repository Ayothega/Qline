import Pusher from "pusher"
import PusherClient from "pusher-js"

// Server-side Pusher instance
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
})

// Client-side Pusher instance
export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
})

// Helper functions for triggering events
export function triggerQueueUpdate(queueId, data) {
  return pusherServer.trigger(`queue-${queueId}`, "queue-updated", data)
}

export function triggerPositionUpdate(queueId, data) {
  return pusherServer.trigger(`queue-${queueId}`, "position-updated", data)
}

export function triggerAdminUpdate(userId, data) {
  return pusherServer.trigger(`admin-${userId}`, "admin-updated", data)
}

// Channel names
export const getQueueChannel = (queueId) => `queue-${queueId}`
export const getAdminChannel = (userId) => `admin-${userId}`
