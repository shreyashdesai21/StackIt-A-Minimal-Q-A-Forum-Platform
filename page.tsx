"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { QuestionCard } from "@/components/question-card"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Tag, MessageSquare, Filter } from "lucide-react"
import { motion } from "framer-motion"
import { useLiteMode } from "@/components/lite-mode-toggle"

const mockSearchResults = {
  questions: [
    {
      id: "1",
      title: "How to implement authentication in Next.js 14 with App Router?",
      snippet: "I'm trying to set up authentication in my Next.js 14 app using the new App Router...",
      author: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        username: "johndoe",
      },
      tags: ["nextjs", "authentication", "app-router"],
      timeAgo: "2h ago",
      votes: 15,
      answers: 3,
      views: 127,
    },
    {
      id: "2",
      title: "TypeScript generic constraints with conditional types",
      snippet: "I'm struggling with creating a generic type that conditionally extends different interfaces...",
      author: {
        name: "Sarah Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
        username: "sarahw",
      },
      tags: ["typescript", "generics", "conditional-types"],
      timeAgo: "4h ago",
      votes: 23,
      answers: 5,
      views: 89,
    },
  ],
  users: [
    {
      id: "1",
      name: "Sarah Wilson",
      username: "sarahw",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 3420,
      questionsCount: 23,
      answersCount: 156,
      topTags: ["react", "typescript", "nextjs"],
    },
    {
      id: "2",
      name: "Mike Chen",
      username: "mikechen",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 2180,
      questionsCount: 45,
      answersCount: 89,
      topTags: ["javascript", "nodejs", "mongodb"],
    },
  ],
  tags: [
    {
      name: "react",
      description: "A JavaScript library for building user interfaces",
      questionCount: 1234,
      followersCount: 567,
    },
    {
      name: "typescript",
      description: "TypeScript is a typed superset of JavaScript",
      questionCount: 892,
      followersCount: 423,
    },
  ],
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [activeTab, setActiveTab] = useState("questions")
  const [sortBy, setSortBy] = useState("relevance")
  const [isLoading, setIsLoading] = useState(true)
  const { isLiteMode } = useLiteMode()

  useEffect(() => {
    // Simulate search API call
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [query])

  const MotionDiv = isLiteMode ? "div" : motion.div
  const motionProps = isLiteMode
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
      }

  const tabs = [
    { id: "questions", label: "Questions", count: mockSearchResults.questions.length, icon: MessageSquare },
    { id: "users", label: "Users", count: mockSearchResults.users.length, icon: User },
    { id: "tags", label: "Tags", count: mockSearchResults.tags.length, icon: Tag },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-800 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-800 rounded w-1/2"></div>
            </div>
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-800 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-800 rounded w-full"></div>
                    <div className="h-4 bg-gray-800 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MotionDiv {...motionProps}>
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Search Results for "{query}"</h1>
            <p className="text-gray-400">
              Found{" "}
              {mockSearchResults.questions.length + mockSearchResults.users.length + mockSearchResults.tags.length}{" "}
              results
            </p>
          </div>

          {/* Search Tabs */}
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="flex space-x-1 bg-gray-900 rounded-lg p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                    <Badge variant="secondary" className="bg-gray-600 text-gray-300 text-xs">
                      {tab.count}
                    </Badge>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px] bg-gray-900 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="votes">Most Votes</SelectItem>
                    <SelectItem value="activity">Recent Activity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="space-y-6">
            {activeTab === "questions" && (
              <div className="space-y-6">
                {mockSearchResults.questions.map((question, index) => (
                  <QuestionCard key={question.id} {...question} index={index} />
                ))}
              </div>
            )}

            {activeTab === "users" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockSearchResults.users.map((user, index) => (
                  <MotionDiv
                    key={user.id}
                    {...(isLiteMode
                      ? {}
                      : {
                          initial: { opacity: 0, y: 20 },
                          animate: { opacity: 1, y: 0 },
                          transition: { delay: index * 0.1 },
                        })}
                  >
                    <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback className="bg-gray-700 text-gray-300 text-lg">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-1">{user.name}</h3>
                            <p className="text-gray-400 mb-3">@{user.username}</p>

                            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                              <div className="text-center">
                                <div className="font-semibold text-white">{user.reputation.toLocaleString()}</div>
                                <div className="text-gray-400">Reputation</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-white">{user.questionsCount}</div>
                                <div className="text-gray-400">Questions</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-white">{user.answersCount}</div>
                                <div className="text-gray-400">Answers</div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {user.topTags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </MotionDiv>
                ))}
              </div>
            )}

            {activeTab === "tags" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockSearchResults.tags.map((tag, index) => (
                  <MotionDiv
                    key={tag.name}
                    {...(isLiteMode
                      ? {}
                      : {
                          initial: { opacity: 0, y: 20 },
                          animate: { opacity: 1, y: 0 },
                          transition: { delay: index * 0.1 },
                        })}
                  >
                    <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <Badge
                            variant="secondary"
                            className="bg-blue-600/20 text-blue-400 border border-blue-600/30 text-lg px-3 py-1"
                          >
                            {tag.name}
                          </Badge>
                          <Button variant="outline" size="sm" className="border-gray-600 bg-transparent">
                            Follow
                          </Button>
                        </div>

                        <p className="text-gray-300 mb-4">{tag.description}</p>

                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <span>{tag.questionCount.toLocaleString()} questions</span>
                          <span>{tag.followersCount} followers</span>
                        </div>
                      </CardContent>
                    </Card>
                  </MotionDiv>
                ))}
              </div>
            )}
          </div>
        </MotionDiv>
      </main>
    </div>
  )
}
