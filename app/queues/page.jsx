"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Users, Clock, MapPin, Filter, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function QueuesPage() {
  const [queuesData, setQueuesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [sortBy, setSortBy] = useState("waitTime")
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)

  // Fetch queues from API
  useEffect(() => {
    fetchQueues()
  }, [searchTerm, selectedCategory, sortBy])

  const fetchQueues = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (selectedCategory) params.append("category", selectedCategory)
      params.append("sortBy", sortBy)

      const response = await fetch(`/api/queues?${params}`)
      const data = await response.json()
      setQueuesData(data)
    } catch (error) {
      console.error("Error fetching queues:", error)
    } finally {
      setLoading(false)
    }
  }

  const categories = Array.from(new Set(queuesData.map((queue) => queue.category)))

  const filteredQueues = queuesData.filter((queue) => {
    const matchesSearch =
      queue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      queue.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory ? queue.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  const sortedQueues = [...filteredQueues].sort((a, b) => {
    if (sortBy === "waitTime") {
      // Simple sort by wait time (in this example, just alphabetically)
      return a.waitTime.localeCompare(b.waitTime)
    } else {
      // Sort by popularity (isPopular first, then by people in queue)
      if (a.isPopular && !b.isPopular) return -1
      if (!a.isPopular && b.isPopular) return 1
      return b.peopleInQueue - a.peopleInQueue
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading queues...</p>
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
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Browse Available Queues</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find and join queues near you. Get real time updates on wait times and your position.
            </p>
          </motion.div>

          <motion.div
            className="mb-8 flex flex-col md:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or location..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>

                <AnimatePresence>
                  {filterMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                    >
                      <div className="p-2">
                        <div className="font-medium px-3 py-2">Categories</div>
                        {categories.map((category) => (
                          <button
                            key={category}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                            onClick={() => {
                              setSelectedCategory(category === selectedCategory ? null : category)
                              setFilterMenuOpen(false)
                            }}
                          >
                            {category}
                            {category === selectedCategory && " ✓"}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setSortBy(sortBy === "waitTime" ? "popularity" : "waitTime")}
              >
                <ArrowUpDown className="h-4 w-4" />
                <span>Sort: {sortBy === "waitTime" ? "Wait Time" : "Popularity"}</span>
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {sortedQueues.map((queue, index) => (
                <motion.div
                  key={queue.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="h-full"
                >
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{queue.name}</CardTitle>
                        {queue.isPopular && <Badge className="bg-purple-600">Popular</Badge>}
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {queue.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="flex justify-between mb-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-4 w-4 text-orange-500" />
                          <span>
                            Wait time: <span className="font-medium">{queue.waitTime}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span>
                            In queue: <span className="font-medium">{queue.peopleInQueue}</span>
                          </span>
                        </div>
                      </div>
                      <div>
                        <Badge
                          variant="outline"
                          className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100"
                        >
                          {queue.category}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Link href={`/queues/${queue.id}`}>Join Queue</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {sortedQueues.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No queues found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory(null)
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
