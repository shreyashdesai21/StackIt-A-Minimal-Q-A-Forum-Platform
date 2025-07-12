"use client"

import { useState } from "react"
import { Bell, MessageSquare, AtSign, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

const mockNotifications = [
  {
    id: 1,
    type: "answer",
    title: "Someone answered your question",
    description: "Your question about React hooks got a new answer",
    time: "5m ago",
    unread: true,
    icon: MessageSquare,
  },
  {
    id: 2,
    type: "mention",
    title: "You were mentioned by @john",
    description: "In the discussion about TypeScript best practices",
    time: "1h ago",
    unread: true,
    icon: AtSign,
  },
  {
    id: 3,
    type: "badge",
    title: "Achievement unlocked!",
    description: 'You earned the "Helpful" badge',
    time: "2h ago",
    unread: false,
    icon: Award,
  },
]

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = mockNotifications.filter((n) => n.unread).length

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-gray-900/95 backdrop-blur-xl border-gray-700" asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <DropdownMenuLabel className="text-white">Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-700" />
          <div className="max-h-96 overflow-y-auto">
            {mockNotifications.map((notification, index) => {
              const Icon = notification.icon
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DropdownMenuItem className="p-4 cursor-pointer hover:bg-gray-800/50">
                    <div className="flex items-start space-x-3 w-full">
                      <div className={`p-2 rounded-full ${notification.unread ? "bg-blue-500/20" : "bg-gray-700/50"}`}>
                        <Icon className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-white truncate">{notification.title}</p>
                          {notification.unread && <div className="h-2 w-2 bg-blue-500 rounded-full ml-2" />}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{notification.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
