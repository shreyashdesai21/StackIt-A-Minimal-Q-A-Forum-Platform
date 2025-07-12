"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Plus, Loader2, Camera } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { RichTextEditor } from "@/components/rich-text-editor"
import { PhotoUpload } from "@/components/photo-upload"
import { MentionInput } from "@/components/mention-input"

export default function AskQuestionPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("editor")

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handlePhotoTextExtracted = (text: string) => {
    if (text && !title) {
      setTitle(text)
      toast.success("Question title auto-filled from image!")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast.success("Question posted successfully!", {
      description: "Your question has been published and is now visible to the community.",
    })

    setIsSubmitting(false)

    // Reset form
    setTitle("")
    setDescription("")
    setTags([])
    setTagInput("")
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Ask a Question</h1>
            <p className="text-gray-400">Get help from the community by asking a detailed question</p>
          </div>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Question Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <Label htmlFor="title" className="text-white">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What's your programming question? Be specific."
                    className="mt-2 bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
                    required
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Be specific and imagine you're asking a question to another person
                  </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <Label className="text-white">Description</Label>

                  <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
                    <TabsList className="bg-gray-800 border-gray-700">
                      <TabsTrigger value="editor" className="data-[state=active]:bg-gray-700">
                        Text Editor
                      </TabsTrigger>
                      <TabsTrigger value="photo" className="data-[state=active]:bg-gray-700">
                        <Camera className="h-4 w-4 mr-2" />
                        Photo Upload
                      </TabsTrigger>
                      <TabsTrigger value="mention" className="data-[state=active]:bg-gray-700">
                        Mention Users
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="editor" className="mt-4">
                      <RichTextEditor
                        content={description}
                        onChange={setDescription}
                        placeholder="Provide all the details someone would need to understand and answer your question..."
                      />
                    </TabsContent>

                    <TabsContent value="photo" className="mt-4">
                      <PhotoUpload
                        onTextExtracted={handlePhotoTextExtracted}
                        onImageUploaded={(url) => {
                          setDescription((prev) => prev + `\n\n![Uploaded Image](${url})\n\n`)
                        }}
                      />
                    </TabsContent>

                    <TabsContent value="mention" className="mt-4">
                      <MentionInput
                        value={description}
                        onChange={setDescription}
                        placeholder="Type @ to mention users who might help with your question..."
                        onMention={(user) => {
                          toast.success(`Mentioned @${user.username}`, {
                            description: "They will be notified about your question.",
                          })
                        }}
                      />
                    </TabsContent>
                  </Tabs>

                  <p className="text-sm text-gray-400 mt-2">
                    Include code snippets, error messages, and what you've already tried. Use @ to mention specific
                    users.
                  </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <Label className="text-white">Tags</Label>
                  <div className="mt-2 space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add a tag (e.g., javascript, react, nodejs)"
                        className="bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addTag()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        variant="outline"
                        className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-blue-600/20 text-blue-400 border border-blue-600/30"
                          >
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="ml-2 hover:text-blue-300">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    <p className="text-sm text-gray-400">Add up to 5 tags to describe what your question is about</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-end space-x-4 pt-6"
                >
                  <Button type="button" variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !title.trim() || !description.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post Question"
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
