"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Input } from "../../components/ui/input"
import { Paperclip, Send, Users } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Badge } from "../../components/ui/badge"

// Define types for better type safety
type UserStatus = "online" | "away" | "offline"

interface User {
  id: number
  name: string
  role: string
  avatar: string
  status: UserStatus
}

interface Message {
  id: number
  sender: string
  role: string
  avatar: string
  content: string
  timestamp: string
}

interface Channel {
  id: string
  name: string
  description: string
}

// Move channel messages outside component to persist between renders
const initialChannelMessages: Record<string, Message[]> = {
  general: [
    {
      id: 1,
      sender: "Sarah Johnson",
      role: "Admin",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Welcome to the Green Team community chat! This is a space for all members to connect, share ideas, and stay updated on our activities.",
      timestamp: "2 days ago",
    },
    {
      id: 2,
      sender: "Michael Brown",
      role: "Volunteer",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Hello everyone! I'm excited to be part of this community.",
      timestamp: "1 day ago",
    },
    {
      id: 3,
      sender: "Emma Wilson",
      role: "Member",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Hi all! I just joined after attending the nature walk last weekend. It was amazing!",
      timestamp: "12 hours ago",
    },
  ],
  volunteers: [
    {
      id: 1,
      sender: "Sarah Johnson",
      role: "Admin",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Hello volunteers! This channel is for coordinating volunteer activities and sharing resources.",
      timestamp: "3 days ago",
    },
    {
      id: 2,
      sender: "David Lee",
      role: "Volunteer",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "I've updated the volunteer schedule for next month. Please check your emails for details.",
      timestamp: "1 day ago",
    },
  ],
  events: [
    {
      id: 1,
      sender: "Sarah Johnson",
      role: "Admin",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Our next community event is the Nature Walk for Kids on June 11. We still need a few more volunteers!",
      timestamp: "2 days ago",
    },
  ],
  "nature-tips": [
    {
      id: 1,
      sender: "Emma Wilson",
      role: "Member",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "I found a great app for identifying plants while hiking. It's called PlantNet and it's free!",
      timestamp: "3 days ago",
    },
    {
      id: 2,
      sender: "Michael Brown",
      role: "Volunteer",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Thanks for sharing, Emma! I'll definitely check it out.",
      timestamp: "2 days ago",
    },
  ],
}

export default function ChatroomPage() {
  const { user, isLoaded } = useUser()
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Use state for channel messages to ensure persistence and proper updates
  const [channelMessages, setChannelMessages] = useState<Record<string, Message[]>>({...initialChannelMessages})

  // Mock channels
  const channels: Channel[] = [
    { id: "general", name: "General", description: "General discussion for all members" },
    { id: "volunteers", name: "Volunteers", description: "Coordination and discussion for volunteers" },
    { id: "events", name: "Events", description: "Updates and discussions about upcoming events" },
    { id: "nature-tips", name: "Nature Tips", description: "Share tips about connecting with nature" },
  ]

  // Mock online users
  const onlineUsers: User[] = [
    { id: 1, name: "Sarah Johnson", role: "Admin", avatar: "/placeholder.svg?height=40&width=40", status: "online" },
    {
      id: 2,
      name: "Michael Brown",
      role: "Volunteer",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
    },
    { id: 3, name: "Emma Wilson", role: "Member", avatar: "/placeholder.svg?height=40&width=40", status: "online" },
    { id: 4, name: "David Lee", role: "Volunteer", avatar: "/placeholder.svg?height=40&width=40", status: "away" },
    { id: 5, name: "Sophia Garcia", role: "Member", avatar: "/placeholder.svg?height=40&width=40", status: "offline" },
  ]

  const [activeChannel, setActiveChannel] = useState("general")
  const [messages, setMessages] = useState<Message[]>(channelMessages.general || [])

  // Show loading state while authentication is being checked
  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // No need to handle unauthenticated state here - middleware will redirect automatically

  // Use effect hooks before any conditional returns
  useEffect(() => {
    setMessages(channelMessages[activeChannel] || [])
  }, [activeChannel, channelMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (message.trim() === "") return

    const newMessage: Message = {
      id: (channelMessages[activeChannel]?.length || 0) + 1,
      sender: user?.fullName || "You",
      role: "Member",
      avatar: user?.imageUrl || "/placeholder.svg?height=40&width=40",
      content: message,
      timestamp: "Just now",
    }

    // Create new array for the current channel messages
    const updatedChannelMessages = { 
      ...channelMessages,
      [activeChannel]: [...(channelMessages[activeChannel] || []), newMessage] 
    }
    
    setChannelMessages(updatedChannelMessages)
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Chat</h1>
          <p className="text-muted-foreground">Connect with other members and volunteers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg">Channels</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="space-y-1">
                {channels.map((channel) => (
                  <Button
                    key={channel.id}
                    variant={activeChannel === channel.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveChannel(channel.id)}
                  >
                    # {channel.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Online</CardTitle>
                <Badge variant="outline" className="ml-2">
                  <Users className="h-3 w-3 mr-1" />
                  {onlineUsers.filter((u) => u.status === "online").length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="py-0">
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {onlineUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-2">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-background ${
                            user.status === "online"
                              ? "bg-green-500"
                              : user.status === "away"
                                ? "bg-yellow-500"
                                : "bg-gray-300"
                          }`}
                        />
                      </div>
                      <div className="grid gap-0.5">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader className="py-4 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>#{channels.find((c) => c.id === activeChannel)?.name}</CardTitle>
                  <CardDescription>{channels.find((c) => c.id === activeChannel)?.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full p-6">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.avatar} />
                        <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{msg.sender}</span>
                          {msg.role && (
                            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {msg.role}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t mt-auto">
              <div className="flex w-full items-center gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Paperclip className="h-4 w-4" />
                  <span className="sr-only">Attach file</span>
                </Button>
                <Input
                  placeholder={`Message #${channels.find((c) => c.id === activeChannel)?.name}`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button size="icon" className="rounded-full" onClick={handleSendMessage} disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}