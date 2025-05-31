import { Server } from "socket.io"

let io

export function initSocket(server) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:3000"],
        methods: ["GET", "POST"],
      },
    })

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id)

      // Join queue room for real-time updates
      socket.on("join-queue", (queueId) => {
        socket.join(`queue-${queueId}`)
        console.log(`Socket ${socket.id} joined queue-${queueId}`)
      })

      // Leave queue room
      socket.on("leave-queue", (queueId) => {
        socket.leave(`queue-${queueId}`)
        console.log(`Socket ${socket.id} left queue-${queueId}`)
      })

      // Join admin dashboard room
      socket.on("join-admin", (userId) => {
        socket.join(`admin-${userId}`)
        console.log(`Socket ${socket.id} joined admin-${userId}`)
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id)
      })
    })
  }

  return io
}

export function getSocket() {
  if (!io) {
    throw new Error("Socket.IO not initialized")
  }
  return io
}

// Emit queue updates to all connected clients
export function emitQueueUpdate(queueId, data) {
  if (io) {
    io.to(`queue-${queueId}`).emit("queue-updated", data)
  }
}

// Emit position updates to specific user
export function emitPositionUpdate(queueId, userId, position, waitTime) {
  if (io) {
    io.to(`queue-${queueId}`).emit("position-updated", {
      userId,
      position,
      waitTime,
    })
  }
}

// Emit admin dashboard updates
export function emitAdminUpdate(userId, data) {
  if (io) {
    io.to(`admin-${userId}`).emit("admin-updated", data)
  }
}
