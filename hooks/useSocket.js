"use client"

import { useEffect, useRef } from "react"
import { io } from "socket.io-client"

export function useSocket() {
  const socketRef = useRef(null)

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(process.env.NODE_ENV === "production" ? "" : "http://localhost:3000", {
      transports: ["websocket", "polling"],
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  const joinQueue = (queueId) => {
    if (socketRef.current) {
      socketRef.current.emit("join-queue", queueId)
    }
  }

  const leaveQueue = (queueId) => {
    if (socketRef.current) {
      socketRef.current.emit("leave-queue", queueId)
    }
  }

  const joinAdmin = (userId) => {
    if (socketRef.current) {
      socketRef.current.emit("join-admin", userId)
    }
  }

  const onQueueUpdate = (callback) => {
    if (socketRef.current) {
      socketRef.current.on("queue-updated", callback)
    }
  }

  const onPositionUpdate = (callback) => {
    if (socketRef.current) {
      socketRef.current.on("position-updated", callback)
    }
  }

  const onAdminUpdate = (callback) => {
    if (socketRef.current) {
      socketRef.current.on("admin-updated", callback)
    }
  }

  const offQueueUpdate = (callback) => {
    if (socketRef.current) {
      socketRef.current.off("queue-updated", callback)
    }
  }

  const offPositionUpdate = (callback) => {
    if (socketRef.current) {
      socketRef.current.off("position-updated", callback)
    }
  }

  const offAdminUpdate = (callback) => {
    if (socketRef.current) {
      socketRef.current.off("admin-updated", callback)
    }
  }

  return {
    socket: socketRef.current,
    joinQueue,
    leaveQueue,
    joinAdmin,
    onQueueUpdate,
    onPositionUpdate,
    onAdminUpdate,
    offQueueUpdate,
    offPositionUpdate,
    offAdminUpdate,
  }
}
