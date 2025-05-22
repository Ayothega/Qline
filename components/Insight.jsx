"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, TrendingUp, Clock, Users, Download } from "lucide-react"
import { motion } from "framer-motion"

export function QueueInsights() {
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Queue Analytics</CardTitle>
            <CardDescription>Insights and statistics about your queues</CardDescription>
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
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="wait-times">Wait Times</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
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
                <p className="text-2xl font-bold">1,248</p>
                <div className="flex items-center mt-2 text-xs text-green-600 dark:text-green-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>12% increase</span>
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
                <p className="text-2xl font-bold">14.2 min</p>
                <div className="flex items-center mt-2 text-xs text-green-600 dark:text-green-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>5% faster</span>
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
                  <Users className="h-4 w-4 text-red-500" />
                </div>
                <p className="text-2xl font-bold">8.3%</p>
                <div className="flex items-center mt-2 text-xs text-red-600 dark:text-red-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>2% increase</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="mb-6"
            >
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-4">Daily Traffic</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {[35, 45, 60, 75, 65, 80, 70].map((value, index) => (
                    <div key={index} className="relative flex-1">
                      <div
                        className="bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-sm"
                        style={{ height: `${value}%` }}
                      ></div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">
                        {["M", "T", "W", "T", "F", "S", "S"][index]}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-xs text-gray-500 dark:text-gray-400 text-center">Days of the week</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-900/50">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-medium text-purple-700 dark:text-purple-400">AI Insight</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Based on your traffic patterns, your busiest times are Tuesdays and Fridays between 2-4 PM. Consider
                  increasing staff during these periods to reduce wait times by an estimated 35%.
                </p>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    Apply Recommendation
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="wait-times">
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-4">Wait Time Distribution</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {/* Placeholder for wait time chart */}
                  <div className="text-center w-full text-gray-500 dark:text-gray-400">
                    Wait time distribution chart would go here
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium mb-4">Wait Time by Hour</h3>
                  <div className="h-48">
                    {/* Placeholder for hourly wait time chart */}
                    <div className="text-center w-full text-gray-500 dark:text-gray-400">
                      Hourly wait time chart would go here
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium mb-4">Wait Time by Day</h3>
                  <div className="h-48">
                    {/* Placeholder for daily wait time chart */}
                    <div className="text-center w-full text-gray-500 dark:text-gray-400">
                      Daily wait time chart would go here
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
                <div className="h-64">
                  {/* Placeholder for traffic patterns chart */}
                  <div className="text-center w-full text-gray-500 dark:text-gray-400">
                    Traffic patterns chart would go here
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium mb-4">Peak Hours</h3>
                  <div className="h-48">
                    {/* Placeholder for peak hours chart */}
                    <div className="text-center w-full text-gray-500 dark:text-gray-400">
                      Peak hours chart would go here
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium mb-4">Customer Retention</h3>
                  <div className="h-48">
                    {/* Placeholder for customer retention chart */}
                    <div className="text-center w-full text-gray-500 dark:text-gray-400">
                      Customer retention chart would go here
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
