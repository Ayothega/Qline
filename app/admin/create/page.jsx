import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save } from "lucide-react";

export default function CreateQueuePage() {
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
                <p className="text-gray-600 dark:text-gray-300">
                  Set up a new queue for your business or event
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-flex mb-6">
              <TabsTrigger value="details">Queue Details</TabsTrigger>
              <TabsTrigger value="fields">Custom Fields</TabsTrigger>
            </TabsList>

            <form>
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Queue Information</CardTitle>
                    <CardDescription>
                      Enter the basic details about your queue
                    </CardDescription>
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
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="food">Food & Drink</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what this queue is for and any special instructions"
                        rows={4}
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Switch id="public" defaultChecked />
                      <Label htmlFor="public">
                        Make this queue publicly visible
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fields">
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Fields</CardTitle>
                    <CardDescription>
                      Define what information you need to collect from people
                      joining your queue
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium">Field #1</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="field1-label">Field Label</Label>
                            <Input
                              id="field1-label"
                              placeholder="e.g., Full Name"
                              defaultValue="Full Name"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="field1-type">Field Type</Label>
                            <Select defaultValue="text">
                              <SelectTrigger id="field1-type">
                                <SelectValue placeholder="Select field type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="tel">
                                  Phone Number
                                </SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="textarea">
                                  Text Area
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center space-x-2">
                          <Switch id="field1-required" defaultChecked />
                          <Label htmlFor="field1-required">
                            Required field
                          </Label>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium">Field #2</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="field2-label">Field Label</Label>
                            <Input
                              id="field2-label"
                              placeholder="e.g., Email"
                              defaultValue="Email Address"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="field2-type">Field Type</Label>
                            <Select defaultValue="email">
                              <SelectTrigger id="field2-type">
                                <SelectValue placeholder="Select field type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="tel">
                                  Phone Number
                                </SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="textarea">
                                  Text Area
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center space-x-2">
                          <Switch id="field2-required" defaultChecked />
                          <Label htmlFor="field2-required">
                            Required field
                          </Label>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                      >
                        Add Another Field
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      type="submit"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Create Queue
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
  );
}
