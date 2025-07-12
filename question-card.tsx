"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, MessageSquare, Eye } from "lucide-react"
import { motion } from "framer-motion"

interface QuestionCardProps {
  id: string
  title: string
  snippet: string
  author: {
    name: string
    avatar: string
    username: string
  }
  tags: string[]
  timeAgo: string
  votes: number
  answers: number
  views: number
  index: number
}

export function QuestionCard({
  id,
  title,
  snippet,
  author,
  tags,
  timeAgo,
  votes,
  answers,
  views,
  index,
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="group"
    >
      <Link href={`/question/${id}`}>
        <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                  {title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{snippet}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300 hover:bg-gray-700 text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                  <AvatarFallback className="bg-gray-700 text-gray-300">{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-300">{author.name}</p>
                  <p className="text-xs text-gray-500">{timeAgo}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <ArrowUp className="h-4 w-4" />
                  <span>{votes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{answers}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{views}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
