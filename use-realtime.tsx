"use client"

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react"
import { toast } from "sonner"

interface RealtimeEvent {
  type: "new_answer" | "new_question" | "vote_update" | "user_online" | "mention" | "system_message"
  data: any
  timestamp: number
  userId?: string
}

interface RealtimeContextType {
  isConnected: boolean
  onlineUsers: number
  subscribe: (eventType: string, callback: (data: any) => void) => () => void
  emit: (event: RealtimeEvent) => void
  connectionStatus: "connecting" | "connected" | "disconnected" | "error"
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

// Simulate WebSocket connection
class MockWebSocket {
  private listeners: Map<string, Set<(data: any) => void>> = new Map()
  private isConnected = false
  private onlineUsers = 0

  connect() {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.isConnected = true
        this.onlineUsers = Math.floor(Math.random() * 50) + 10
        resolve()

        // Simulate periodic events
        this.startSimulation()
      }, 1000)
    })
  }

  private startSimulation() {
    // Simulate online user count changes
    setInterval(() => {
      this.onlineUsers += Math.floor(Math.random() * 5) - 2
      this.onlineUsers = Math.max(5, Math.min(100, this.onlineUsers))
      this.emit("user_count_update", { count: this.onlineUsers })
    }, 10000)

    // Simulate random events
    setInterval(() => {
      const events = [
        {
          type: "new_answer",
          data: {
            questionId: "123",
            questionTitle: "How to use React hooks effectively?",
            authorName: "John Doe",
          },
        },
        {
          type: "new_question",
          data: {
            id: "456",
            title: "Best practices for TypeScript in 2024?",
            authorName: "Jane Smith",
            tags: ["typescript", "best-practices"],
          },
        },
        {
          type: "vote_update",
          data: {
            itemId: "789",
            itemType: "question",
            newVoteCount: Math.floor(Math.random() * 50),
          },
        },
      ]

      const randomEvent = events[Math.floor(Math.random() * events.length)]
      this.emit(randomEvent.type, randomEvent.data)
    }, 15000)
  }

  subscribe(eventType: string, callback: (data: any) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }
    this.listeners.get(eventType)!.add(callback)

    return () => {
      this.listeners.get(eventType)?.delete(callback)
    }
  }

  emit(eventType: string, data: any) {
    const callbacks = this.listeners.get(eventType)
    if (callbacks) {
      callbacks.forEach((callback) => callback(data))
    }
  }

  disconnect() {
    this.isConnected = false
    this.listeners.clear()
  }

  get connected() {
    return this.isConnected
  }

  get userCount() {
    return this.onlineUsers
  }
}

const mockWs = new MockWebSocket()

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected" | "error">(
    "disconnected",
  )

  useEffect(() => {
    setConnectionStatus("connecting")

    mockWs
      .connect()
      .then(() => {
        setIsConnected(true)
        setOnlineUsers(mockWs.userCount)
        setConnectionStatus("connected")

        // Subscribe to user count updates
        const unsubscribe = mockWs.subscribe("user_count_update", (data) => {
          setOnlineUsers(data.count)
        })

        // Subscribe to notifications
        const unsubscribeNotifications = mockWs.subscribe("new_answer", (data) => {
          toast.success("New Answer!", {
            description: `${data.authorName} answered "${data.questionTitle}"`,
          })
        })

        const unsubscribeQuestions = mockWs.subscribe("new_question", (data) => {
          toast.info("New Question!", {
            description: `${data.authorName} asked about ${data.tags.join(", ")}`,
          })
        })

        return () => {
          unsubscribe()
          unsubscribeNotifications()
          unsubscribeQuestions()
          mockWs.disconnect()
        }
      })
      .catch(() => {
        setConnectionStatus("error")
      })
  }, [])

  const subscribe = useCallback((eventType: string, callback: (data: any) => void) => {
    return mockWs.subscribe(eventType, callback)
  }, [])

  const emit = useCallback((event: RealtimeEvent) => {
    mockWs.emit(event.type, event.data)
  }, [])

  return (
    <RealtimeContext.Provider value={{ isConnected, onlineUsers, subscribe, emit, connectionStatus }}>
      {children}
    </RealtimeContext.Provider>
  )
}

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error("useRealtime must be used within a RealtimeProvider")
  }
  return context
}

// Custom hook for live vote updates
export function useLiveVotes(itemId: string, initialVotes: number) {
  const [votes, setVotes] = useState(initialVotes)
  const { subscribe } = useRealtime()

  useEffect(() => {
    const unsubscribe = subscribe("vote_update", (data) => {
      if (data.itemId === itemId) {
        setVotes(data.newVoteCount)
      }
    })

    return unsubscribe
  }, [itemId, subscribe])

  return votes
}

// Custom hook for online status
export function useOnlineStatus() {
  const { isConnected, onlineUsers, connectionStatus } = useRealtime()
  return { isConnected, onlineUsers, connectionStatus }
}
