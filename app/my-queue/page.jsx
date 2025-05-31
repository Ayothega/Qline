"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Info, Mail, Phone, Bell, QrCode, ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { usePusher } from "@/hooks/usePusher"

export default function MyQueuePage() {
  const router = useRouter()
  const { isConnected, subscribeToQueue, unsubscribeFromQueue } = usePusher()
  const [queueInfo, setQueueInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState("")

  useEffect(() => {
    fetchMyQueue()
  }, [])

  useEffect(() => {
    if (queueInfo?.id && isConnected) {
      const channel = subscribeToQueue(queueInfo.id)

      // Listen for position updates
      channel.bind("position-updated", (data) => {
        const userId = localStorage.getItem("userId")
        if (data.updates) {
          const userUpdate = data.updates.find((update) => update.userId === userId)
          if (userUpdate) {
            setQueueInfo((prev) =>
              prev
                ? {
                    ...prev,
                    position: userUpdate.position,
                    waitTime: userUpdate.waitTime,
                  }
                : null,
            )

            // Update progress
            const calculatedProgress = Math.min(Math.floor(100 - userUpdate.position * 10), 99)
            setProgress(calculatedProgress)
            setTimeRemaining(userUpdate.waitTime)
          }
        }
      })

      return () => {
        unsubscribeFromQueue(queueInfo.id)
      }
    }
  }, [queueInfo?.id, isConnected, subscribeToQueue, unsubscribeFromQueue])

  const fetchMyQueue = async () => {
    try {
      const response = await fetch("/api/my-queue")
      if (response.ok) {
        const data = await response.json()
        if (data.id) {
          setQueueInfo(data)

          // Calculate progress based on position
          const calculatedProgress = Math.min(Math.floor(100 - data.position * 10), 99)
          setProgress(calculatedProgress)

          // Set time remaining
          setTimeRemaining(data.waitTime)
        }
      }
    } catch (error) {
      console.error("Error fetching queue status:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveQueue = async () => {
    if (!queueInfo) return

    try {
      // Find the entry ID (you might need to modify the API to return this)
      const response = await fetch(`/api/queues/${queueInfo.id}/entries/${queueInfo.entryId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        localStorage.removeItem("currentQueue")
        localStorage.removeItem("userId")
        router.push("/queues")
      }
    } catch (error) {
      console.error("Error leaving queue:", error)
      // Fallback to localStorage removal
      localStorage.removeItem("currentQueue")
      localStorage.removeItem("userId")
      router.push("/queues")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading your queue information...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!queueInfo) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-md mx-auto"
            >
              <div className="mb-6">
                <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">You're not in any queue</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  You haven't joined any queue yet. Browse available queues to get started.
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Link href="/queues">Browse Queues</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/queues" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" /> Back to queues
              </Link>
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <h1 className="text-3xl font-bold">My Queue Status</h1>
                <p className="text-gray-600 dark:text-gray-300">Track your position with real-time Pusher updates</p>
              </div>

              {/* Pusher Connection Status */}
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {isConnected ? "Pusher connected" : "Connecting to Pusher..."}
                </span>
                <Zap className={`h-4 w-4 ${isConnected ? "text-green-500" : "text-red-500"}`} />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-purple-200 dark:border-purple-900/50 overflow-hidden">
              <CardHeader className="bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-900/50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{queueInfo.name}</CardTitle>
                    <CardDescription>
                      Joined at{" "}
                      {new Date(queueInfo.joinedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-600">Active</Badge>
                    {isConnected && (
                      <Badge variant="outline" className="border-green-500 text-green-600">
                        <Zap className="h-3 w-3 mr-1" />
                        Pusher Live
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-3xl font-bold mb-4"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    #{queueInfo.position}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">Your position in line</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Estimated wait time: <span className="font-medium">{timeRemaining}</span>
                  </p>
                  {isConnected && (
                    <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                      ⚡ Real-time updates via Pusher - you'll be notified instantly when it's almost your turn!
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Waiting</span>
                    <span>Almost there!</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">{progress}% complete</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-1">
                      <QrCode className="h-4 w-4" /> Check-in Code
                    </h4>
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                      <div className="text-2xl font-mono font-bold mb-2">
                        QG{queueInfo.id}
                        {queueInfo.position}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Show this code when it's your turn</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-1">
                      <Bell className="h-4 w-4" /> Notifications
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-purple-500" />
                        <div>
                          <div className="font-medium">{queueInfo.userData.email}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Email notifications enabled</div>
                        </div>
                      </div>

                      {queueInfo.userData.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-purple-500" />
                          <div>
                            <div className="font-medium">{queueInfo.userData.phone}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">SMS notifications enabled</div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-green-500" />
                        <div>
                          <div className="font-medium">Pusher real-time updates</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {isConnected ? "Connected and active" : "Reconnecting..."}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-medium mb-2">
                    <Info className="h-4 w-4" />
                    <span>Real-time Queue Updates</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Powered by Pusher, you'll receive instant notifications when you're 3rd in line and when it's your
                    turn. Your position updates automatically as people are served - no need to refresh!
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={handleLeaveQueue}
                >
                  Leave Queue
                </Button>
                <Button
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={() => router.push("/queues")}
                >
                  Browse Other Queues
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
