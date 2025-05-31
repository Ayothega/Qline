"use client"

import { useEffect, useRef, useState } from "react"
import { pusherClient } from "@/lib/pusher"

export function usePusher() {
  const [isConnected, setIsConnected] = useState(false)
  const channelsRef = useRef(new Set())

  useEffect(() => {
    // Connection state listeners
    pusherClient.connection.bind("connected", () => {
      setIsConnected(true)
      console.log("Pusher connected")
    })

    pusherClient.connection.bind("disconnected", () => {
      setIsConnected(false)
      console.log("Pusher disconnected")
    })

    pusherClient.connection.bind("error", (error) => {
      console.error("Pusher connection error:", error)
      setIsConnected(false)
    })

    return () => {
      // Cleanup: unsubscribe from all channels
      channelsRef.current.forEach((channelName) => {
        pusherClient.unsubscribe(channelName)
      })
      channelsRef.current.clear()
    }
  }, [])

  const subscribeToChannel = (channelName) => {
    if (!channelsRef.current.has(channelName)) {
      const channel = pusherClient.subscribe(channelName)
      channelsRef.current.add(channelName)
      return channel
    }
    return pusherClient.channel(channelName)
  }

  const unsubscribeFromChannel = (channelName) => {
    if (channelsRef.current.has(channelName)) {
      pusherClient.unsubscribe(channelName)
      channelsRef.current.delete(channelName)
    }
  }

  const subscribeToQueue = (queueId) => {
    const channelName = `queue-${queueId}`
    return subscribeToChannel(channelName)
  }

  const unsubscribeFromQueue = (queueId) => {
    const channelName = `queue-${queueId}`
    unsubscribeFromChannel(channelName)
  }

  const subscribeToAdmin = (userId) => {
    const channelName = `admin-${userId}`
    return subscribeToChannel(channelName)
  }

  const unsubscribeFromAdmin = (userId) => {
    const channelName = `admin-${userId}`
    unsubscribeFromChannel(channelName)
  }

  return {
    isConnected,
    subscribeToQueue,
    unsubscribeFromQueue,
    subscribeToAdmin,
    unsubscribeFromAdmin,
    pusherClient,
  }
}
