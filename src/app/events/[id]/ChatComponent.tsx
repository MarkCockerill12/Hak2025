"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Send, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

// Type for chat messages
type ChatMessage = {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  createdAt: string;
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
  };
};

export function ChatComponent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { id: eventId } = useParams<{ id: string }>();
  const { user } = useUser();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      // This would be an API endpoint to fetch messages for this event
      const response = await fetch(`/api/chat/messages?eventId=${String(eventId)}`);
      if (!response.ok) { throw new Error("Failed to fetch messages"); }
      const data = await response.json() as ChatMessage[];
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load chat messages");
    }
  };

  // Fetch messages on component mount
  useEffect(() => {
    if (eventId) {
      void fetchMessages();
    }
  }, [eventId, fetchMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const messageSchema = z.string().min(1);

    try {
      // Validate input
      messageSchema.parse(inputValue);

      setIsLoading(true);

      // Send message to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: eventId,
          message: inputValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || "Failed to send message");
      }

      const newMessage = await response.json() as ChatMessage;

      // Optimistically update UI
      setMessages((prev) => [...prev, {
        ...newMessage,
        user: {
          id: user?.id || "",
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          imageUrl: user?.imageUrl || "",
        }
      }]);

      setInputValue("");
    } catch (error) {
      console.error("Error sending message:", error);
      setError(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get initials for avatar fallback
  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "?";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">Event Chat</CardTitle>
      </CardHeader>

      {error && (
        <Alert variant="destructive" className="mx-4 mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div key={-1} className="text-center text-muted-foreground py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => {
              const isCurrentUser = message.userId === user?.id;

              return (
                <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.user?.imageUrl} />
                      <AvatarFallback>
                        {getInitials(message.user?.firstName, message.user?.lastName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <div className={`px-4 py-2 rounded-lg ${isCurrentUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                        }`}>
                        <p>{message.message}</p>
                      </div>
                      <span className={`text-xs text-muted-foreground mt-1 ${isCurrentUser ? 'text-right' : 'text-left'
                        }`}>
                        {format(new Date(message.createdAt), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      <Separator />

      <CardFooter className="p-4">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
