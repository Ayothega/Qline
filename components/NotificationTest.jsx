"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare, CheckCircle, XCircle, Loader2 } from "lucide-react"

export function NotificationTest() {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    email: "",
    phone: "",
  })
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])

  const notificationTypes = [
    { value: "welcome", label: "Welcome Message" },
    { value: "queue-created", label: "Queue Created" },
    { value: "queue-joined", label: "Queue Joined" },
    { value: "your-turn", label: "Your Turn Alert" },
    { value: "queue-update", label: "Queue Update" },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResults([])

    try {
      const response = await fetch("/api/notifications/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setResults(data.result || [])
      } else {
        setResults([{ type: "error", success: false, error: data.error }])
      }
    } catch (error) {
      setResults([{ type: "error", success: false, error: error.message }])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Notification Testing
        </CardTitle>
        <CardDescription>Test email and SMS notifications for different queue events</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Notification Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select notification type" />
                </SelectTrigger>
                <SelectContent>
                  {notificationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !formData.type || !formData.name}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending Notifications...
              </>
            ) : (
              "Send Test Notifications"
            )}
          </Button>
        </form>

        {results.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="font-medium">Results:</h3>
            {results.map((result, index) => (
              <div key={index} className="flex items-center gap-2 p-3 rounded-lg border">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}

                <div className="flex items-center gap-2">
                  {result.type === "email" ? (
                    <Mail className="h-4 w-4" />
                  ) : result.type === "sms" ? (
                    <MessageSquare className="h-4 w-4" />
                  ) : null}

                  <Badge variant={result.success ? "default" : "destructive"}>{result.type}</Badge>
                </div>

                <span className="text-sm text-gray-600">
                  {result.success
                    ? result.id || result.messageId
                      ? `Sent successfully (ID: ${result.id || result.messageId})`
                      : "Sent successfully"
                    : `Failed: ${result.error}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
