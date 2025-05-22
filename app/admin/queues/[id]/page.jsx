"use client";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { QueueManagement } from "@/components/Management";
import { QueueInsights } from "@/components/Insight";

// Sample queue data
const queueData = {
  id: "1",
  name: "Coffee Shop Queue",
  location: "Downtown Branch",
  status: "active",
  peopleWaiting: 8,
  averageWaitTime: "10 min",
  capacity: 80,
  createdAt: "2023-05-15T10:00:00Z",
};

export default function QueueDetailPage() {
  const params = useParams();
  const queueId = params.id;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/admin/dashboard" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" /> Back to dashboard
              </Link>
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{queueData.name}</h1>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Active
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {queueData.location} • Created on{" "}
                  {new Date(queueData.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  asChild
                  className="flex items-center gap-1"
                >
                  <Link href={`/admin/queues/${queueId}/settings`}>
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  View Public Page
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>People Waiting</CardDescription>
                  <CardTitle className="text-2xl">
                    {queueData.peopleWaiting}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1 text-blue-500" />
                    <span>
                      Current capacity: {queueData.peopleWaiting}/
                      {queueData.capacity}
                    </span>
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
                  <CardDescription>Average Wait Time</CardDescription>
                  <CardTitle className="text-2xl">
                    {queueData.averageWaitTime}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1 text-orange-500" />
                    <span>5% faster than yesterday</span>
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
                  <CardDescription>Served Today</CardDescription>
                  <CardTitle className="text-2xl">42</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1 text-green-500" />
                    <span>12 more than yesterday</span>
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
                  <CardDescription>Abandonment Rate</CardDescription>
                  <CardTitle className="text-2xl">8.3%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1 text-red-500" />
                    <span>2% increase from average</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Tabs defaultValue="queue" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-flex mb-6">
              <TabsTrigger value="queue">Queue Management</TabsTrigger>
              <TabsTrigger value="insights">Analytics & Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="queue">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <QueueManagement />
              </motion.div>
            </TabsContent>

            <TabsContent value="insights">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <QueueInsights />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
