"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Zap, ZapOff } from "lucide-react"
import { toast } from "sonner"

interface LiteModeContextType {
  isLiteMode: boolean
  toggleLiteMode: () => void
}

const LiteModeContext = createContext<LiteModeContextType | undefined>(undefined)

export function LiteModeProvider({ children }: { children: ReactNode }) {
  const [isLiteMode, setIsLiteMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("stackit-lite-mode")
    if (saved) {
      setIsLiteMode(JSON.parse(saved))
    }
  }, [])

  const toggleLiteMode = () => {
    const newMode = !isLiteMode
    setIsLiteMode(newMode)
    localStorage.setItem("stackit-lite-mode", JSON.stringify(newMode))

    toast.success(newMode ? "Lite mode enabled" : "Lite mode disabled", {
      description: newMode
        ? "Reduced animations and simplified UI for better performance"
        : "Full experience restored with animations and rich features",
    })
  }

  return (
    <LiteModeContext.Provider value={{ isLiteMode, toggleLiteMode }}>
      <div className={isLiteMode ? "lite-mode" : ""}>{children}</div>
    </LiteModeContext.Provider>
  )
}

export function useLiteMode() {
  const context = useContext(LiteModeContext)
  if (context === undefined) {
    throw new Error("useLiteMode must be used within a LiteModeProvider")
  }
  return context
}

export function LiteModeToggle() {
  const { isLiteMode, toggleLiteMode } = useLiteMode()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLiteMode}
      className="text-gray-400 hover:text-white"
      title={isLiteMode ? "Disable lite mode" : "Enable lite mode"}
    >
      {isLiteMode ? <ZapOff className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
    </Button>
  )
}
