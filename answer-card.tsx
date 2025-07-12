"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { motion } from "framer-motion"
import { VotingSystem } from "./voting-system"

interface AnswerCardProps {
  id: string
  content: string
  author: {
    name: string
    avatar: string
    username: string
    reputation: number
  }
  timeAgo: string
  votes: number
  isAccepted?: boolean
  index: number
}

export function AnswerCard({ id, content, author, timeAgo, votes, isAccepted = false, index }: AnswerCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <Card className={`bg-gray-900/50 border-gray-800 ${isAccepted ? "border-green-500/50 bg-green-500/5" : ""}`}>
        <CardContent className="p-6">
          <div className="flex gap-4">
            {/* Vote buttons */}
            <div className="flex flex-col items-center space-y-2">
              <VotingSystem itemId={id} initialVotes={votes} canAccept={true} isAccepted={isAccepted} type="answer" />
              {isAccepted && (
                <div className="p-2 bg-green-500/20 rounded-full">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
              )}
            </div>

            {/* Answer content */}
            <div className="flex-1">
              {isAccepted && (
                <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30">✓ Accepted Answer</Badge>
              )}

              <div className="prose prose-invert max-w-none mb-6">
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">{content}</div>
              </div>

              {/* Author info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                    <AvatarFallback className="bg-gray-700 text-gray-300">{author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">{author.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <span>{author.reputation} reputation</span>
                      <span>•</span>
                      <span>{timeAgo}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
