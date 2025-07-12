"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Filter, X, User, Tag, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

interface SearchResult {
  id: string
  type: "question" | "answer" | "user" | "tag"
  title: string
  snippet?: string
  author?: {
    name: string
    avatar: string
  }
  tags?: string[]
  votes?: number
  answers?: number
  reputation?: number
  questionCount?: number
}

const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    type: "question",
    title: "How to implement authentication in Next.js 14?",
    snippet: "I'm trying to set up authentication in my Next.js 14 app using the new App Router...",
    author: { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
    tags: ["nextjs", "authentication"],
    votes: 15,
    answers: 3,
  },
  {
    id: "2",
    type: "user",
    title: "Sarah Wilson",
    reputation: 3420,
    questionCount: 45,
  },
  {
    id: "3",
    type: "tag",
    title: "react",
    questionCount: 1234,
  },
]

const popularSearches = ["Next.js", "React hooks", "TypeScript", "Authentication", "Database design"]

interface AdvancedSearchProps {
  onSearch?: (query: string, filters: SearchFilters) => void
  className?: string
}

interface SearchFilters {
  type: "all" | "questions" | "answers" | "users" | "tags"
  sortBy: "relevance" | "newest" | "votes" | "activity"
  dateRange: "all" | "day" | "week" | "month" | "year"
  tags: string[]
}

export function AdvancedSearch({ onSearch, className = "" }: AdvancedSearchProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    type: "all",
    sortBy: "relevance",
    dateRange: "all",
    tags: [],
  })

  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Simulate search API call
  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setResults(mockSearchResults.filter((result) => result.title.toLowerCase().includes(query.toLowerCase())))
        setIsLoading(false)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setResults([])
    }
  }, [query])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery, filters)
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsOpen(false)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false)
    switch (result.type) {
      case "question":
        router.push(`/question/${result.id}`)
        break
      case "user":
        router.push(`/user/${result.id}`)
        break
      case "tag":
        router.push(`/tag/${result.title}`)
        break
    }
  }

  const addTagFilter = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      setFilters((prev) => ({ ...prev, tags: [...prev.tags, tag] }))
    }
  }

  const removeTagFilter = (tag: string) => {
    setFilters((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search questions, users, tags..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch()
            }
          }}
          className="pl-10 pr-20 bg-gray-900/50 border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-gray-900 border-gray-700" align="end">
              <div className="space-y-4">
                <h4 className="font-medium text-white">Search Filters</h4>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Content Type</label>
                  <Select
                    value={filters.type}
                    onValueChange={(value: any) => setFilters((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">All Content</SelectItem>
                      <SelectItem value="questions">Questions</SelectItem>
                      <SelectItem value="answers">Answers</SelectItem>
                      <SelectItem value="users">Users</SelectItem>
                      <SelectItem value="tags">Tags</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Sort By</label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value: any) => setFilters((prev) => ({ ...prev, sortBy: value }))}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="votes">Most Votes</SelectItem>
                      <SelectItem value="activity">Recent Activity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Date Range</label>
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value: any) => setFilters((prev) => ({ ...prev, dateRange: value }))}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="day">Past Day</SelectItem>
                      <SelectItem value="week">Past Week</SelectItem>
                      <SelectItem value="month">Past Month</SelectItem>
                      <SelectItem value="year">Past Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {filters.tags.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Active Tag Filters</label>
                    <div className="flex flex-wrap gap-1">
                      {filters.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-blue-600/20 text-blue-400">
                          {tag}
                          <button onClick={() => removeTagFilter(tag)} className="ml-1 hover:text-blue-300">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Search Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
          >
            {query.length <= 2 ? (
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-3">Popular Searches</h4>
                <div className="space-y-2">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className="flex items-center w-full p-2 text-left hover:bg-gray-800 rounded text-gray-300 hover:text-white"
                    >
                      <TrendingUp className="h-4 w-4 mr-3 text-gray-500" />
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            ) : isLoading ? (
              <div className="p-4 text-center text-gray-400">Searching...</div>
            ) : results.length > 0 ? (
              <div className="p-2">
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full p-3 text-left hover:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-start space-x-3">
                      {result.type === "question" && <Search className="h-4 w-4 mt-1 text-blue-400" />}
                      {result.type === "user" && <User className="h-4 w-4 mt-1 text-green-400" />}
                      {result.type === "tag" && <Tag className="h-4 w-4 mt-1 text-purple-400" />}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-white font-medium truncate">{result.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {result.type}
                          </Badge>
                        </div>

                        {result.snippet && <p className="text-sm text-gray-400 line-clamp-2 mb-2">{result.snippet}</p>}

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          {result.author && (
                            <div className="flex items-center space-x-1">
                              <Avatar className="h-4 w-4">
                                <AvatarImage
                                  src={result.author.avatar || "/placeholder.svg"}
                                  alt={result.author.name}
                                />
                                <AvatarFallback className="text-xs">{result.author.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{result.author.name}</span>
                            </div>
                          )}
                          {result.votes !== undefined && <span>{result.votes} votes</span>}
                          {result.answers !== undefined && <span>{result.answers} answers</span>}
                          {result.reputation !== undefined && <span>{result.reputation} reputation</span>}
                          {result.questionCount !== undefined && <span>{result.questionCount} questions</span>}
                        </div>

                        {result.tags && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {result.tags.slice(0, 3).map((tag) => (
                              <button
                                key={tag}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  addTagFilter(tag)
                                }}
                                className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded hover:bg-gray-700"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-400">No results found for "{query}"</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
