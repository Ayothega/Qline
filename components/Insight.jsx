"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, TrendingUp, Clock, Users, Download, BarChart3, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function QueueInsights() {
  const params = useParams()
  const queueId = params?.id
  const [timeRange, setTimeRange] = useState("7d")
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [aiInsights, setAiInsights] = useState("")
  const [loadingInsights, setLoadingInsights] = useState(false)

  useEffect(() => {
    if (queueId) {
      fetchAnalytics()
    }
  }, [queueId, timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/queues/${queueId}/analytics?timeRange=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateAIInsights = async () => {
    try {
      setLoadingInsights(true)
      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queueId }),
      })

      if (response.ok) {
        const data = await response.json()
        setAiInsights(data.insights)
      }
    } catch (error) {
      console.error("Error generating AI insights:", error)
    } finally {
      setLoadingInsights(false)
    }
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Queue Analytics & AI Insights</CardTitle>
            <CardDescription>Intelligent insights and statistics about your queue performance</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="wait-times">Wait Times</TabsTrigger>
            <TabsTrigger value="traffic">Traffic Patterns</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Served</h3>
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-2xl font-bold">{analyticsData?.totalServed || 0}</p>
                <div className="flex items-center mt-2 text-xs text-green-600 dark:text-green-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>12% increase from last period</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Wait Time</h3>
                  <Clock className="h-4 w-4 text-orange-500" />
                </div>
                <p className="text-2xl font-bold">{analyticsData?.avgWaitTime || "0 min"}</p>
                <div className="flex items-center mt-2 text-xs text-green-600 dark:text-green-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>5% faster than average</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Abandonment Rate</h3>
                  <BarChart3 className="h-4 w-4 text-red-500" />
                </div>
                <p className="text-2xl font-bold">{analyticsData?.abandonmentRate || "0%"}</p>
                <div className="flex items-center mt-2 text-xs text-red-600 dark:text-red-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>2% increase from average</span>
                </div>
              </motion.div>
            </div>

            {/* Daily Traffic Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="mb-6"
            >
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-4">Daily Traffic</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {analyticsData?.dailyTraffic?.length > 0 ? (
                    analyticsData.dailyTraffic.map((day, index) => {
                      const maxCount = Math.max(...analyticsData.dailyTraffic.map((d) => d.count))
                      const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0
                      return (
                        <div key={index} className="relative flex-1">
                          <div
                            className="bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-sm transition-all duration-500"
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">
                            {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                          </div>
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-300">
                            {day.count}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="w-full text-center text-gray-500 dark:text-gray-400">
                      No traffic data available for this period
                    </div>
                  )}
                </div>
                <div className="mt-8 text-xs text-gray-500 dark:text-gray-400 text-center">Days</div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="ai-insights">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg border border-purple-100 dark:border-purple-900/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-lg font-medium text-purple-700 dark:text-purple-400">AI-Powered Insights</h3>
                  </div>
                  <Button
                    onClick={generateAIInsights}
                    disabled={loadingInsights}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {loadingInsights ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Insights
                      </>
                    )}
                  </Button>
                </div>

                {aiInsights ? (
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{aiInsights}</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-purple-400 opacity-50" />
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Get AI-powered insights about your queue performance and optimization suggestions.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Click "Generate Insights" to analyze your queue data with artificial intelligence.
                    </p>
                  </div>
                )}
              </div>

              {/* Quick AI Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    Peak Time Optimization
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Based on your traffic patterns, consider these optimizations for peak hours.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Recommendations
                  </Button>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    Customer Experience
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    AI suggestions to improve customer satisfaction and reduce abandonment.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Suggestions
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="wait-times">
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-4">Wait Time Distribution</h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Wait time distribution chart</p>
                    <p className="text-sm">Data visualization coming soon</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium mb-4">Peak Hours</h3>
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Peak hours analysis</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium mb-4">Wait Time Trends</h3>
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Trend analysis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="traffic">
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-4">Traffic Patterns</h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Traffic patterns visualization</p>
                    <p className="text-sm">Advanced analytics coming soon</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium mb-4">Busiest Days</h3>
                  <div className="space-y-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                      (day, index) => {
                        const isActive = index < 3 // Mock data - first 3 days are busiest
                        return (
                          <div key={day} className="flex items-center justify-between">
                            <span className="text-sm">{day}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    isActive ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"
                                  }`}
                                  style={{ width: `${isActive ? (3 - index) * 30 + 40 : 20}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {isActive ? `${(3 - index) * 10 + 20}` : "5"}
                              </span>
                            </div>
                          </div>
                        )
                      },
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium mb-4">Customer Satisfaction</h3>
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Satisfaction metrics</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
