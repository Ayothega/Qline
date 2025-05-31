"use client"

import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Plus, X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateQueuePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: "",
    description: "",
    isPublic: true,
  })
  const [customFields, setCustomFields] = useState([
    { id: 1, label: "Full Name", type: "text", required: true },
    { id: 2, label: "Email Address", type: "email", required: true },
  ])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/queues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          customFields: customFields.map(({ id, ...field }) => field), // Remove id before sending
        }),
      })

      if (response.ok) {
        const queue = await response.json()
        router.push(`/admin/queues/${queue.id}`)
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to create queue")
      }
    } catch (error) {
      console.error("Error creating queue:", error)
      alert(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFieldChange = (fieldId, property, value) => {
    setCustomFields((prev) => prev.map((field) => (field.id === fieldId ? { ...field, [property]: value } : field)))
  }

  const addNewField = () => {
    const newId = Math.max(...customFields.map((f) => f.id)) + 1
    setCustomFields((prev) => [
      ...prev,
      {
        id: newId,
        label: "",
        type: "text",
        required: false,
      },
    ])
  }

  const removeField = (fieldId) => {
    if (customFields.length > 1) {
      setCustomFields((prev) => prev.filter((field) => field.id !== fieldId))
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/admin/dashboard" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" /> Back to dashboard
              </Link>
            </Button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">Create New Queue</h1>
                <p className="text-gray-600 dark:text-gray-300">Set up a new queue for your business or event</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-flex mb-6">
              <TabsTrigger value="details">Queue Details</TabsTrigger>
              <TabsTrigger value="fields">Custom Fields</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Queue Information</CardTitle>
                    <CardDescription>Enter the basic details about your queue</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Queue Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="e.g., Coffee Shop Service"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">
                        Location <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="location"
                        placeholder="e.g., 123 Main St, City"
                        required
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Food & Drink">Food & Drink</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Government">Government</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Financial">Financial</SelectItem>
                          <SelectItem value="Transportation">Transportation</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what this queue is for and any special instructions"
                        rows={4}
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Switch
                        id="public"
                        checked={formData.isPublic}
                        onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
                      />
                      <Label htmlFor="public">Make this queue publicly visible</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fields">
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Fields</CardTitle>
                    <CardDescription>
                      Define what information you need to collect from people joining your queue
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {customFields.map((field, index) => (
                        <div key={field.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium">Field #{index + 1}</h3>
                            {customFields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeField(field.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`field-${field.id}-label`}>Field Label</Label>
                              <Input
                                id={`field-${field.id}-label`}
                                placeholder="e.g., Full Name"
                                value={field.label}
                                onChange={(e) => handleFieldChange(field.id, "label", e.target.value)}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`field-${field.id}-type`}>Field Type</Label>
                              <Select
                                value={field.type}
                                onValueChange={(value) => handleFieldChange(field.id, "type", value)}
                              >
                                <SelectTrigger id={`field-${field.id}-type`}>
                                  <SelectValue placeholder="Select field type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Text</SelectItem>
                                  <SelectItem value="email">Email</SelectItem>
                                  <SelectItem value="tel">Phone Number</SelectItem>
                                  <SelectItem value="number">Number</SelectItem>
                                  <SelectItem value="date">Date</SelectItem>
                                  <SelectItem value="textarea">Text Area</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center space-x-2">
                            <Switch
                              id={`field-${field.id}-required`}
                              checked={field.required}
                              onCheckedChange={(checked) => handleFieldChange(field.id, "required", checked)}
                            />
                            <Label htmlFor={`field-${field.id}-required`}>Required field</Label>
                          </div>
                        </div>
                      ))}

                      <Button type="button" variant="outline" className="w-full" onClick={addNewField}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another Field
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={() => router.push("/admin/dashboard")}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSubmitting ? "Creating..." : "Create Queue"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </form>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
