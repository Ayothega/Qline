import Link from "next/link";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Clock, CheckCircle } from "lucide-react";

// Sample data for the dashboard
const queueData = {
  activeQueues: 2,
  totalPeopleWaiting: 15,
  averageWaitTime: "12 min",
  servedToday: 42,
  queues: [
    {
      id: "5",
      name: "Zenith Bank",
      location: "5 Unity Rd, Ilorin 240101, Kwara",
      status: "active",
      peopleWaiting: 15,
      averageWaitTime: "20 min",
      capacity: 80,
    },
    {
      id: "2",
      name: "Tech Store Customer Service",
      location: "101 Gadget Lane, Mall",
      status: "active",
      peopleWaiting: 12,
      averageWaitTime: "15 min",
      capacity: 70,
    },
  ],
};

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Queue Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your queues and monitor real-time activity
              </p>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active Queues</CardDescription>
                <CardTitle className="text-2xl">
                  {queueData.activeQueues}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-1 text-green-500" />
                  <span>All queues operational</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>People Waiting</CardDescription>
                <CardTitle className="text-2xl">
                  {queueData.totalPeopleWaiting}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Users className="h-4 w-4 mr-1 text-blue-500" />
                  <span>Across all queues</span>
                </div>
              </CardContent>
            </Card>

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

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Served Today</CardDescription>
                <CardTitle className="text-2xl">
                  {queueData.servedToday}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  <span>12 more than yesterday</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Queues</CardTitle>
              <CardDescription>
                Overview of all your active and scheduled queues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {queueData.queues.map((queue) => (
                  <div
                    key={queue.id}
                    className="p-4 border rounded-lg border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{queue.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {queue.location}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center text-sm mb-2">
                      <span>
                        Capacity: {queue.peopleWaiting}/{queue.capacity}
                      </span>
                      <span>Wait: {queue.averageWaitTime}</span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/queues/${queue.id}`}>Manage</Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/queues/${queue.id}/settings`}>
                            Settings
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
