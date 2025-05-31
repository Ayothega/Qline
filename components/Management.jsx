"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, XCircle, Clock, MessageSquare, Search, Plus, Brain, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePusher } from "@/hooks/usePusher"

export function QueueManagement() {
  const params = useParams()
  const queueId = params?.id
  const { isConnected, subscribeToQueue, unsubscribeFromQueue } = usePusher()

  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [isAddingPerson, setIsAddingPerson] = useState(false)
  const [newPersonData, setNewPersonData] = useState({
    name: "",
    email: "",
    phone: "",
    groupSize: "1",
    notes: "",
  })

  useEffect(() => {
    if (queueId) {
      fetchQueueEntries()
    }
  }, [queueId])

  useEffect(() => {
    if (queueId && isConnected) {
      const channel = subscribeToQueue(queueId)

      // Listen for queue updates
      channel.bind("queue-updated", (data) => {
        // Refresh the queue entries when updates occur
        fetchQueueEntries()
      })

      // Listen for position updates
      channel.bind("position-updated", (data) => {
        // Refresh the queue entries to show updated positions
        fetchQueueEntries()
      })

      return () => {
        unsubscribeFromQueue(queueId)
      }
    }
  }, [queueId, isConnected, subscribeToQueue, unsubscribeFromQueue])

  const fetchQueueEntries = async () => {
    try {
      const response = await fetch(`/api/queues/${queueId}/entries`)
      if (response.ok) {
        const data = await response.json()
        setPeople(data)
      }
    } catch (error) {
      console.error("Error fetching queue entries:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleServe = async (id) => {
    try {
      const response = await fetch(`/api/queues/${queueId}/entries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "serve" }),
      })

      if (response.ok) {
        // The real-time update will refresh the list automatically via Pusher
        console.log("Person served successfully")
      }
    } catch (error) {
      console.error("Error serving person:", error)
    }
  }

  const handleSkip = async (id) => {
    try {
      const response = await fetch(`/api/queues/${queueId}/entries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "skip" }),
      })

      if (response.ok) {
        // The real-time update will refresh the list automatically via Pusher
        console.log("Person skipped successfully")
      }
    } catch (error) {
      console.error("Error skipping person:", error)
    }
  }

  const handleAddPerson = async () => {
    try {
      const response = await fetch(`/api/queues/${queueId}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPersonData),
      })

      if (response.ok) {
        // The real-time update will refresh the list automatically via Pusher
        setIsAddingPerson(false)
        setNewPersonData({
          name: "",
          email: "",
          phone: "",
          groupSize: "1",
          notes: "",
        })
      }
    } catch (error) {
      console.error("Error adding person:", error)
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

  const filteredPeople = people.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.phone.includes(searchTerm),
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              Queue Management
              {isConnected && (
                <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                  <Zap className="h-4 w-4" />
                  <span>Live</span>
                </div>
              )}
            </CardTitle>
            <CardDescription>Manage people in your active queue with real-time Pusher updates</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search queue..."
                className="pl-9 w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setIsAddingPerson(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Real-time Status Indicator */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/50 flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                {isConnected ? "⚡ Real-time updates active" : "🔄 Connecting to Pusher..."}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {isConnected
                  ? "Queue updates automatically when people are served or join"
                  : "Attempting to establish real-time connection"}
              </p>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-900/50 flex gap-3 mb-6">
            <div className="shrink-0">
              <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">AI Suggestion</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Based on current traffic and staff availability, consider serving groups of 3+ people first to optimize
                seating capacity. This could reduce overall wait time by 15%.
              </p>
            </div>
          </div>

          <AnimatePresence>
            {filteredPeople.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No people in queue matching your search.</p>
              </div>
            ) : (
              filteredPeople.map((person, index) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`border rounded-lg overflow-hidden ${
                    selectedPerson === person.id
                      ? "border-purple-300 dark:border-purple-700"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div
                    className={`p-4 cursor-pointer ${
                      selectedPerson === person.id
                        ? "bg-purple-50 dark:bg-purple-900/20"
                        : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                    onClick={() => setSelectedPerson(selectedPerson === person.id ? null : person.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-medium">
                          {person.position}
                        </div>
                        <div>
                          <div className="font-medium">{person.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Group of {person.groupSize} • Joined at {person.joinedAt}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-orange-500" />
                            {person.waitTime} wait
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Position #{person.position}</div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSkip(person.id)
                            }}
                          >
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Skip</span>
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleServe(person.id)
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Serve</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedPerson === person.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400">Email:</span>
                                <span>{person.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                                <span>{person.phone}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Notes</h4>
                            <p className="text-sm">{person.notes || "No notes available."}</p>
                          </div>
                        </div>

                        <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>Send Message</span>
                          </Button>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => handleSkip(person.id)}
                            >
                              Skip
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleServe(person.id)}
                            >
                              Serve Now
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </CardContent>

      <Dialog open={isAddingPerson} onOpenChange={setIsAddingPerson}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Person to Queue</DialogTitle>
            <DialogDescription>Enter the details of the person you want to add to the queue.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={newPersonData.name}
                onChange={(e) => setNewPersonData({ ...newPersonData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={newPersonData.email}
                onChange={(e) => setNewPersonData({ ...newPersonData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                value={newPersonData.phone}
                onChange={(e) => setNewPersonData({ ...newPersonData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupSize">Group Size</Label>
              <Input
                id="groupSize"
                type="number"
                min="1"
                placeholder="Enter group size"
                value={newPersonData.groupSize}
                onChange={(e) => setNewPersonData({ ...newPersonData, groupSize: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Enter any special notes"
                value={newPersonData.notes}
                onChange={(e) => setNewPersonData({ ...newPersonData, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingPerson(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPerson}>Add to Queue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
