"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { NotificationTest } from "@/components/NotificationTest"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare, Bell, Settings, Users, Clock } from "lucide-react"

export default function NotificationsPage() {
  const features = [
    {
      icon: <Mail className="h-6 w-6 text-blue-500" />,
      title: "Email Notifications",
      description: "Rich HTML emails with beautiful templates for all queue events",
      status: "Active",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-green-500" />,
      title: "SMS Notifications",
      description: "Instant SMS alerts for urgent updates and position changes",
      status: "Active",
    },
    {
      icon: <Bell className="h-6 w-6 text-purple-500" />,
      title: "Real-time Updates",
      description: "Live notifications via Pusher for immediate queue updates",
      status: "Active",
    },
    {
      icon: <Users className="h-6 w-6 text-orange-500" />,
      title: "User Preferences",
      description: "Customizable notification settings for each user",
      status: "Coming Soon",
    },
  ]

  const notificationTypes = [
    {
      name: "Welcome Message",
      description: "Sent when users first join QLine",
      channels: ["Email", "SMS"],
      trigger: "User Registration",
    },
    {
      name: "Queue Created",
      description: "Confirmation when queue owners create new queues",
      channels: ["Email", "SMS"],
      trigger: "Queue Creation",
    },
    {
      name: "Queue Joined",
      description: "Confirmation when users join a queue",
      channels: ["Email", "SMS"],
      trigger: "Queue Entry",
    },
    {
      name: "Your Turn Alert",
      description: "Urgent notification when it's the user's turn",
      channels: ["Email", "SMS", "Push"],
      trigger: "Position #1",
    },
    {
      name: "Queue Updates",
      description: "Position changes and wait time updates",
      channels: ["Email", "SMS"],
      trigger: "Position Change",
    },
    {
      name: "Position Alerts",
      description: "Alerts when users are in top 3 positions",
      channels: ["SMS"],
      trigger: "Top 3 Positions",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Notification System</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage and test email and SMS notifications for queue events
            </p>
          </div>

          {/* Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    {feature.icon}
                    <Badge variant={feature.status === "Active" ? "default" : "secondary"}>{feature.status}</Badge>
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Notification Types */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Types
              </CardTitle>
              <CardDescription>Overview of all notification types and their triggers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificationTypes.map((type, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{type.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{type.description}</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">Trigger: {type.trigger}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {type.channels.map((channel) => (
                        <Badge key={channel} variant="outline" className="text-xs">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Test Interface */}
          <NotificationTest />
        </div>
      </main>
      <Footer />
    </div>
  )
}
