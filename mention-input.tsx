"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AtSign } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useLiteMode } from "./lite-mode-toggle"

interface MentionUser {
  id: string
  name: string
  username: string
  avatar: string
  reputation: number
  isOnline?: boolean
}

interface MentionInputProps {
  value: string
  onChange: (value: string) => void
  onMention?: (user: MentionUser) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

const mockUsers: MentionUser[] = [
  {
    id: "1",
    name: "Sarah Wilson",
    username: "sarahw",
    avatar: "/placeholder.svg?height=32&width=32",
    reputation: 3420,
    isOnline: true,
  },
  {
    id: "2",
    name: "Mike Chen",
    username: "mikechen",
    avatar: "/placeholder.svg?height=32&width=32",
    reputation: 2180,
    isOnline: false,
  },
  {
    id: "3",
    name: "John Doe",
    username: "johndoe",
    avatar: "/placeholder.svg?height=32&width=32",
    reputation: 1250,
    isOnline: true,
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    username: "alexr",
    avatar: "/placeholder.svg?height=32&width=32",
    reputation: 1890,
    isOnline: false,
  },
]

export function MentionInput({
  value,
  onChange,
  onMention,
  placeholder = "Type @ to mention someone...",
  className = "",
  disabled = false,
}: MentionInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredUsers, setFilteredUsers] = useState<MentionUser[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [mentionQuery, setMentionQuery] = useState("")
  const [mentionStart, setMentionStart] = useState(-1)
  const [cursorPosition, setCursorPosition] = useState(0)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const { isLiteMode } = useLiteMode()

  // Parse mentions in text and highlight them
  const parseText = (text: string) => {
    const mentionRegex = /@(\w+)/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = mentionRegex.exec(text)) !== null) {
      // Add text before mention
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: text.slice(lastIndex, match.index),
        })
      }

      // Add mention
      parts.push({
        type: "mention",
        content: match[0],
        username: match[1],
      })

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: "text",
        content: text.slice(lastIndex),
      })
    }

    return parts
  }

  // Handle input changes and detect @ mentions
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      const cursorPos = e.target.selectionStart

      onChange(newValue)
      setCursorPosition(cursorPos)

      // Check for @ mention
      const textBeforeCursor = newValue.slice(0, cursorPos)
      const mentionMatch = textBeforeCursor.match(/@(\w*)$/)

      if (mentionMatch) {
        const query = mentionMatch[1].toLowerCase()
        const start = cursorPos - mentionMatch[0].length

        setMentionQuery(query)
        setMentionStart(start)
        setShowSuggestions(true)
        setSelectedIndex(0)

        // Filter users based on query
        const filtered = mockUsers.filter(
          (user) => user.username.toLowerCase().includes(query) || user.name.toLowerCase().includes(query),
        )
        setFilteredUsers(filtered)
      } else {
        setShowSuggestions(false)
        setMentionQuery("")
        setMentionStart(-1)
      }
    },
    [onChange],
  )

  // Handle keyboard navigation in suggestions
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions || filteredUsers.length === 0) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % filteredUsers.length)
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length)
          break
        case "Enter":
        case "Tab":
          e.preventDefault()
          selectUser(filteredUsers[selectedIndex])
          break
        case "Escape":
          setShowSuggestions(false)
          break
      }
    },
    [showSuggestions, filteredUsers, selectedIndex],
  )

  // Select a user from suggestions
  const selectUser = useCallback(
    (user: MentionUser) => {
      if (mentionStart === -1) return

      const beforeMention = value.slice(0, mentionStart)
      const afterMention = value.slice(cursorPosition)
      const newValue = `${beforeMention}@${user.username} ${afterMention}`

      onChange(newValue)
      onMention?.(user)
      setShowSuggestions(false)

      // Focus back to textarea and set cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPos = mentionStart + user.username.length + 2
          textareaRef.current.focus()
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
        }
      }, 0)
    },
    [value, mentionStart, cursorPosition, onChange, onMention],
  )

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  const MotionDiv = isLiteMode ? "div" : motion.div

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full min-h-[120px] p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
          style={{ lineHeight: "1.5" }}
        />

        {/* Mention indicator */}
        {showSuggestions && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 text-xs">
              <AtSign className="h-3 w-3 mr-1" />
              Mentioning
            </Badge>
          </div>
        )}
      </div>

      {/* Mention suggestions */}
      <AnimatePresence>
        {showSuggestions && filteredUsers.length > 0 && (
          <MotionDiv
            ref={suggestionsRef}
            {...(isLiteMode
              ? {}
              : {
                  initial: { opacity: 0, y: -10 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -10 },
                })}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="bg-gray-900/95 backdrop-blur-xl border-gray-700 shadow-xl">
              <CardContent className="p-2">
                <div className="space-y-1">
                  {filteredUsers.map((user, index) => (
                    <button
                      key={user.id}
                      onClick={() => selectUser(user)}
                      className={`w-full p-3 text-left rounded-lg transition-colors ${
                        index === selectedIndex ? "bg-blue-600/20 border border-blue-600/30" : "hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback className="bg-gray-700 text-gray-300 text-sm">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {user.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 border-2 border-gray-900 rounded-full"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-white truncate">{user.name}</span>
                            <span className="text-sm text-gray-400">@{user.username}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{user.reputation.toLocaleString()} reputation</span>
                            {user.isOnline && (
                              <Badge variant="secondary" className="bg-green-600/20 text-green-400 text-xs">
                                Online
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-gray-700">
                  <p className="text-xs text-gray-500 text-center">
                    Use ↑↓ to navigate, Enter to select, Esc to cancel
                  </p>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Display parsed text with highlighted mentions (for preview) */}
      {value && (
        <div className="mt-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400 mb-2">Preview:</p>
          <div className="text-sm text-gray-300">
            {parseText(value).map((part, index) => (
              <span key={index}>
                {part.type === "mention" ? (
                  <span className="bg-blue-600/20 text-blue-400 px-1 py-0.5 rounded">{part.content}</span>
                ) : (
                  part.content
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
