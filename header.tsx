"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Menu, X, User, LogOut, Settings, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { EnhancedNotifications } from "./enhanced-notifications"
import { AdvancedSearch } from "./advanced-search"
import { LiteModeToggle } from "./lite-mode-toggle"
import { AuthModal } from "./auth/auth-modal"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { useOnlineStatus } from "@/hooks/use-realtime"
import { useLiteMode } from "./lite-mode-toggle"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const { user, logout, isAdmin } = useAuth()
  const { isConnected, onlineUsers, connectionStatus } = useOnlineStatus()
  const { isLiteMode } = useLiteMode()

  const handleAuthClick = (mode: "login" | "register") => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  const MotionDiv = isLiteMode ? "div" : motion.div
  const motionProps = isLiteMode
    ? {}
    : {
        initial: { y: -100 },
        animate: { y: 0 },
        transition: { duration: 0.3 },
      }

  return (
    <>
      <MotionDiv
        className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-xl"
        {...motionProps}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <MotionDiv
                className="flex items-center space-x-2"
                {...(isLiteMode ? {} : { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } })}
              >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  StackIt
                </span>
              </MotionDiv>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <AdvancedSearch className="w-full" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                {isConnected ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-400" />
                    <span>{onlineUsers} online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-red-400" />
                    <span>Offline</span>
                  </>
                )}
              </div>

              <LiteModeToggle />

              {user ? (
                <>
                  <EnhancedNotifications />
                  <Link href="/ask">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Ask Question
                    </Button>
                  </Link>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback className="bg-gray-700 text-gray-300">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700" align="end">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium text-white">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {user.reputation} reputation
                            </Badge>
                            {isAdmin && (
                              <Badge variant="destructive" className="text-xs">
                                Admin
                              </Badge>
                            )}
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem asChild>
                        <Link href={`/user/${user.id}`} className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-400">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" onClick={() => handleAuthClick("login")}>
                    Sign In
                  </Button>
                  <Button onClick={() => handleAuthClick("register")} className="bg-blue-600 hover:bg-blue-700">
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <MotionDiv
                {...(isLiteMode
                  ? {}
                  : {
                      initial: { opacity: 0, height: 0 },
                      animate: { opacity: 1, height: "auto" },
                      exit: { opacity: 0, height: 0 },
                    })}
                className="md:hidden border-t border-gray-800 py-4"
              >
                <div className="space-y-4">
                  <AdvancedSearch className="w-full" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      {isConnected ? (
                        <>
                          <Wifi className="h-4 w-4 text-green-400" />
                          <span>{onlineUsers} online</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="h-4 w-4 text-red-400" />
                          <span>Offline</span>
                        </>
                      )}
                    </div>
                    <LiteModeToggle />
                  </div>

                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <EnhancedNotifications />
                        <Link href="/ask">
                          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Ask Question
                          </Button>
                        </Link>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback className="bg-gray-700 text-gray-300">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.reputation} reputation</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Link href={`/user/${user.id}`}>
                          <Button variant="ghost" className="w-full justify-start">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Button>
                        </Link>
                        {isAdmin && (
                          <Link href="/admin">
                            <Button variant="ghost" className="w-full justify-start">
                              <Settings className="mr-2 h-4 w-4" />
                              Admin Dashboard
                            </Button>
                          </Link>
                        )}
                        <Button variant="ghost" onClick={logout} className="w-full justify-start text-red-400">
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button variant="ghost" onClick={() => handleAuthClick("login")} className="w-full">
                        Sign In
                      </Button>
                      <Button
                        onClick={() => handleAuthClick("register")}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </MotionDiv>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultMode={authMode} />
    </>
  )
}
