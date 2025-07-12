"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, Check } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface VotingSystemProps {
  itemId: string
  initialVotes: number
  userVote?: "up" | "down" | null
  canAccept?: boolean
  isAccepted?: boolean
  onAccept?: () => void
  type: "question" | "answer"
}

export function VotingSystem({
  itemId,
  initialVotes,
  userVote = null,
  canAccept = false,
  isAccepted = false,
  onAccept,
  type,
}: VotingSystemProps) {
  const [votes, setVotes] = useState(initialVotes)
  const [currentVote, setCurrentVote] = useState<"up" | "down" | null>(userVote)

  const handleVote = (voteType: "up" | "down") => {
    let newVotes = votes
    let newCurrentVote: "up" | "down" | null = voteType

    // Calculate vote changes
    if (currentVote === voteType) {
      // Remove vote
      newVotes += voteType === "up" ? -1 : 1
      newCurrentVote = null
    } else if (currentVote === null) {
      // Add new vote
      newVotes += voteType === "up" ? 1 : -1
    } else {
      // Change vote
      newVotes += voteType === "up" ? 2 : -2
    }

    setVotes(newVotes)
    setCurrentVote(newCurrentVote)

    toast.success(`${type === "question" ? "Question" : "Answer"} ${voteType}voted!`)
  }

  const handleAccept = () => {
    if (onAccept) {
      onAccept()
      toast.success("Answer marked as accepted!")
    }
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote("up")}
        className={`p-2 hover:bg-gray-800 ${currentVote === "up" ? "text-green-400 bg-green-400/10" : "text-gray-400"}`}
      >
        <ArrowUp className="h-6 w-6" />
      </Button>

      <motion.span
        key={votes}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        className="text-xl font-semibold text-white"
      >
        {votes}
      </motion.span>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote("down")}
        className={`p-2 hover:bg-gray-800 ${currentVote === "down" ? "text-red-400 bg-red-400/10" : "text-gray-400"}`}
      >
        <ArrowDown className="h-6 w-6" />
      </Button>

      {canAccept && type === "answer" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAccept}
          className={`p-2 hover:bg-gray-800 ${isAccepted ? "text-green-400 bg-green-400/20" : "text-gray-400"}`}
        >
          <Check className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
