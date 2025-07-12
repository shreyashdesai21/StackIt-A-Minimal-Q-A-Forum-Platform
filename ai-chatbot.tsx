"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Bot,
  Loader2,
  Sparkles,
  HelpCircle,
  BookOpen,
  Users,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useLiteMode } from "./lite-mode-toggle"

interface ChatMessage {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  query: string
}

const quickActions: QuickAction[] = [
  {
    id: "how-to-ask",
    label: "How to ask a question?",
    icon: <HelpCircle className="h-4 w-4" />,
    query: "How do I ask a good question on StackIt?",
  },
  {
    id: "reputation",
    label: "About reputation system",
    icon: <Sparkles className="h-4 w-4" />,
    query: "How does the reputation system work?",
  },
  {
    id: "community",
    label: "Community guidelines",
    icon: <Users className="h-4 w-4" />,
    query: "What are the community guidelines?",
  },
  {
    id: "features",
    label: "Platform features",
    icon: <BookOpen className="h-4 w-4" />,
    query: "What features does StackIt offer?",
  },
]

const botResponses: Record<string, string> = {
  "how do i ask a good question on stackit": `Great question! Here's how to ask an effective question on StackIt:

📝 **Be Specific**: Write a clear, descriptive title that summarizes your problem
🔍 **Research First**: Search existing questions to avoid duplicates
📋 **Provide Context**: Include relevant code, error messages, and what you've tried
🏷️ **Use Tags**: Add relevant tags to help others find and answer your question
📸 **Add Images**: Upload screenshots or photos of code/errors when helpful
💡 **Show Effort**: Explain what you've attempted and what didn't work

Remember: The more details you provide, the better answers you'll receive!`,

  "how does the reputation system work": `The StackIt reputation system rewards helpful contributions:

⭐ **Earning Reputation**:
• +10 for each upvote on your question
• +10 for each upvote on your answer
• +15 for having your answer accepted
• +2 for accepting an answer to your question

🏆 **Reputation Benefits**:
• 50+ rep: Comment on any post
• 100+ rep: Vote up questions and answers
• 200+ rep: Vote down (costs 1 rep)
• 500+ rep: Access to review queues
• 1000+ rep: See vote counts

🎖️ **Badges**: Earn badges for various achievements and milestones!`,

  "what are the community guidelines": `StackIt community guidelines ensure a positive environment:

✅ **Do**:
• Be respectful and professional
• Ask clear, specific questions
• Provide helpful, accurate answers
• Use proper formatting and tags
• Search before posting duplicates
• Accept helpful answers

❌ **Don't**:
• Post spam or promotional content
• Use offensive language or harassment
• Ask homework questions without effort
• Post the same question multiple times
• Argue in comments - use chat instead

🚫 **Violations may result in warnings, suspensions, or account termination.**`,

  "what features does stackit offer": `StackIt offers comprehensive Q&A platform features:

🔧 **Core Features**:
• Question & Answer system with voting
• Rich text editor with code highlighting
• Photo upload with OCR text extraction
• @mention system for user notifications
• Real-time updates and notifications
• Advanced search with filters

👥 **Community Features**:
• User profiles with reputation tracking
• Badge system for achievements
• Following users and tags
• Real-time chat and discussions

🎨 **User Experience**:
• Dark theme optimized interface
• Lite mode for better performance
• Mobile-responsive design
• Multiple authentication options

🔒 **Security & Privacy**:
• Secure authentication with multiple providers
• Content moderation and reporting
• Privacy controls and data protection`,

  default: `I'm StackIt's AI assistant! I can help you with:

• How to use the platform effectively
• Understanding the reputation system
• Community guidelines and best practices
• Platform features and functionality
• Getting started tips

Try asking me something like "How do I ask a good question?" or use the quick actions below!`,
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "bot",
      content:
        "👋 Hi! I'm StackBot, your AI assistant for StackIt. I'm here to help you navigate the platform, understand our features, and make the most of your Q&A experience. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { isLiteMode } = useLiteMode()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateTyping = async (response: string) => {
    setIsTyping(true)

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: `typing-${Date.now()}`,
      type: "bot",
      content: "",
      timestamp: new Date(),
      isTyping: true,
    }

    setMessages((prev) => [...prev, typingMessage])

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    // Remove typing indicator and add actual response
    setMessages((prev) => prev.filter((msg) => !msg.isTyping))

    const botMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      type: "bot",
      content: response,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, botMessage])
    setIsTyping(false)
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Find appropriate response
    const query = content.toLowerCase()
    let response = botResponses.default

    for (const [key, value] of Object.entries(botResponses)) {
      if (key !== "default" && query.includes(key)) {
        response = value
        break
      }
    }

    // Special handling for specific queries
    if (query.includes("reputation") || query.includes("points") || query.includes("score")) {
      response = botResponses["how does the reputation system work"]
    } else if (query.includes("question") && (query.includes("ask") || query.includes("post"))) {
      response = botResponses["how do i ask a good question on stackit"]
    } else if (query.includes("rule") || query.includes("guideline") || query.includes("policy")) {
      response = botResponses["what are the community guidelines"]
    } else if (query.includes("feature") || query.includes("what can") || query.includes("what does")) {
      response = botResponses["what features does stackit offer"]
    }

    await simulateTyping(response)
  }

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.query)
  }

  const MotionDiv = isLiteMode ? "div" : motion.div

  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <MotionDiv
            {...(isLiteMode
              ? {}
              : {
                  initial: { scale: 0, opacity: 0 },
                  animate: { scale: 1, opacity: 1 },
                  exit: { scale: 0, opacity: 0 },
                })}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            {...(isLiteMode
              ? {}
              : {
                  initial: { opacity: 0, y: 20, scale: 0.95 },
                  animate: { opacity: 1, y: 0, scale: 1 },
                  exit: { opacity: 0, y: 20, scale: 0.95 },
                })}
            className={`fixed bottom-6 right-6 z-50 ${isMinimized ? "w-80" : "w-96"} transition-all duration-200`}
          >
            <Card className="bg-gray-900/95 backdrop-blur-xl border-gray-700 shadow-2xl">
              {/* Header */}
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="StackBot" />
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 border-2 border-gray-900 rounded-full"></div>
                    </div>
                    <div>
                      <CardTitle className="text-sm text-white">StackBot</CardTitle>
                      <p className="text-xs text-gray-400">AI Assistant • Online</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="h-8 w-8 p-0"
                    >
                      {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {!isMinimized && (
                <CardContent className="p-0">
                  {/* Messages */}
                  <div className="h-96 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"
                          }`}
                        >
                          {message.isTyping ? (
                            <div className="flex items-center space-x-1">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div
                                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-400 ml-2">StackBot is typing...</span>
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                          )}
                          <div className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Actions */}
                  {messages.length <= 1 && (
                    <div className="p-4 border-t border-gray-700">
                      <p className="text-xs text-gray-400 mb-3">Quick actions:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {quickActions.map((action) => (
                          <Button
                            key={action.id}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAction(action)}
                            className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-left justify-start h-auto p-2"
                          >
                            <div className="flex items-center space-x-2">
                              {action.icon}
                              <span className="text-xs">{action.label}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div className="p-4 border-t border-gray-700">
                    <div className="flex space-x-2">
                      <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask me anything about StackIt..."
                        className="bg-gray-800 border-gray-700 focus:border-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage(inputValue)
                          }
                        }}
                        disabled={isTyping}
                      />
                      <Button
                        onClick={() => handleSendMessage(inputValue)}
                        disabled={!inputValue.trim() || isTyping}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  )
}
