"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Clock, CheckCircle, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/dashboard")
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                You don't have any queues yet. Create your first queue to get started!
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Link href="/admin/create" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Create Your First Queue</span>
                </Link>
              </Button>
            </div>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold">Queue Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">Manage your queues and monitor real-time activity</p>
            </div>

            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Link href="/admin/create" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Create New Queue</span>
              </Link>
            </Button>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Active Queues</CardDescription>
                  <CardTitle className="text-2xl">{dashboardData.activeQueues}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1 text-green-500" />
                    <span>All queues operational</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>People Waiting</CardDescription>
                  <CardTitle className="text-2xl">{dashboardData.totalPeopleWaiting}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Users className="h-4 w-4 mr-1 text-blue-500" />
                    <span>Across all queues</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Average Wait Time</CardDescription>
                  <CardTitle className="text-2xl">{dashboardData.averageWaitTime}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <TrendingUp className="h-4 w-4 mr-1 text-orange-500" />
                    <span>5% faster than yesterday</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Served Today</CardDescription>
                  <CardTitle className="text-2xl">{dashboardData.servedToday}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    <span>
                      {dashboardData.servedToday > 0 ? "12 more than yesterday" : "Start serving customers today"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Queues List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Queues</CardTitle>
                <CardDescription>Overview of all your active queues</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.queues.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No queues yet</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Create your first queue to start managing customer flow
                    </p>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Link href="/admin/create">Create Queue</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.queues.map((queue, index) => (
                      <motion.div
                        key={queue.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 border rounded-lg border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{queue.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{queue.location}</p>
                          </div>
                          <Badge
                            className={
                              queue.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                            }
                          >
                            {queue.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        <div className="flex justify-between items-center text-sm mb-4">
                          <span>
                            People waiting: <span className="font-medium">{queue.peopleWaiting}</span>
                          </span>
                          <span>
                            Avg wait: <span className="font-medium">{queue.averageWaitTime}</span>
                          </span>
                        </div>

                        {/* Progress bar for capacity */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>Capacity</span>
                            <span>
                              {queue.peopleWaiting}/{queue.capacity}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min((queue.peopleWaiting / queue.capacity) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/admin/queues/${queue.id}`}>Manage Queue</Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/queues/${queue.id}`}>View Public Page</Link>
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
