"use client"

import { useState } from "react"
import { Button } from "src/components/ui/button"
import { useRouter } from "next/navigation"
import { leaveEvent } from "./actions"

interface LeaveButtonProps {
  children: React.ReactNode
  eventId: string | undefined
}

export function LeaveButton({ children, eventId }: LeaveButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleLeave() {
    setIsLoading(true)
    if (!eventId) {
      return null;
    }
    try {
      // Call server action to leave the event
      await leaveEvent(eventId)

      // Refresh the page to show updated event list
      router.refresh()
    } catch (error) {
      console.error("Error leaving event:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="secondary"
      onClick={handleLeave}
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : children}
    </Button>
  )
}
