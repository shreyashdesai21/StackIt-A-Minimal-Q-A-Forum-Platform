"use client"

import { useState } from "react"
import { Bell, MessageSquare, AtSign, Award, CheckCircle, UserPlus, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

interface Notification {
  id: string
  type: "answer" | "mention" | "badge" | "accepted" | "follow" | "admin"
  title: string
  description: string
  time: string
  unread: boolean
  user?: {
    name: string
    avatar: string
  }
  questionId?: string
  answerId?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "answer",
    title: "New answer on your question",
    description: "Someone answered your question about React hooks",
    time: "2m ago",
    unread: true,
    user: {
      name: "Sarah Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    questionId: "1",
  },
  {
    id: "2",
    type: "mention",
    title: "You were mentioned",
    description: "@john mentioned you in a discussion about TypeScript",
    time: "15m ago",
    unread: true,
    user: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    questionId: "2",
  },
  {
    id: "3",
    type: "accepted",
    title: "Your answer was accepted!",
    description: "Your answer about Next.js authentication was marked as accepted",
    time: "1h ago",
    unread: true,
    questionId: "1",
  },
  {
    id: "4",
    type: "badge",
    title: "Achievement unlocked!",
    description: 'You earned the "Helpful Contributor" badge',
    time: "2h ago",
    unread: false,
  },
  {
    id: "5",
    type: "follow",
    title: "New follower",
    description: "Mike Chen started following you",
    time: "3h ago",
    unread: false,
    user: {
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: "6",
    type: "admin",
    title: "Platform Update",
    description: "New rich text editor features are now available!",
    time: "1d ago",
    unread: false,
  },
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "answer":
      return MessageSquare
    case "mention":
      return AtSign
    case "badge":
      return Award
    case "accepted":
      return CheckCircle
    case "follow":
      return UserPlus
    case "admin":
      return AlertTriangle
    default:
      return Bell
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case "answer":
      return "text-blue-400"
    case "mention":
      return "text-purple-400"
    case "badge":
      return "text-yellow-400"
    case "accepted":
      return "text-green-400"
    case "follow":
      return "text-pink-400"
    case "admin":
      return "text-orange-400"
    default:
      return "text-gray-400"
  }
}

export function EnhancedNotifications() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadCount = notifications.filter((n) => n.unread).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 bg-gray-900/95 backdrop-blur-xl border-gray-700" asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <DropdownMenuLabel className="text-white text-lg">Notifications</DropdownMenuLabel>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-blue-400 hover:text-blue-300">
                Mark all read
              </Button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification, index) => {
                const Icon = getNotificationIcon(notification.type)
                const iconColor = getNotificationColor(notification.type)

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <DropdownMenuItem
                      className="p-4 cursor-pointer hover:bg-gray-800/50 border-l-4 border-transparent hover:border-blue-500"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3 w-full">
                        <div
                          className={`p-2 rounded-full ${notification.unread ? "bg-blue-500/20" : "bg-gray-700/50"}`}
                        >
                          <Icon className={`h-4 w-4 ${iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-white truncate">{notification.title}</p>
                            {notification.unread && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full ml-2 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mb-2 line-clamp-2">{notification.description}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">{notification.time}</p>
                            {notification.user && (
                              <div className="flex items-center space-x-1">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage
                                    src={notification.user.avatar || "/placeholder.svg"}
                                    alt={notification.user.name}
                                  />
                                  <AvatarFallback className="bg-gray-700 text-gray-300 text-xs">
                                    {notification.user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-gray-400">{notification.user.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </motion.div>
                )
              })
            )}
          </div>
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-700">
              <Button variant="ghost" className="w-full text-blue-400 hover:text-blue-300">
                View all notifications
              </Button>
            </div>
          )}
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
