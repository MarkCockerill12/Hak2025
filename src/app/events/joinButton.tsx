"use client"

import { Button } from "~/components/ui/button";
import { useTransition } from "react";
import { joinEventAction } from "./action"; // import the server action
import { type ReactNode } from "react";

// Updated to accept children prop
export function JoinButton({
  eventId,
  children
}: {
  eventId: string | undefined,
  children?: ReactNode
}) {
  const [isPending, startTransition] = useTransition();

  if (!eventId) {
    return null; // or show an error/fallback UI
  }

  const handleJoin = () => {
    startTransition(async () => {
      try {
        // Use the server action through the imported function
        await joinEventAction(eventId);
      } catch (error) {
        console.error("Failed to join event:", error);
      }
    });
  };

  return (
    <Button
      onClick={handleJoin}
      disabled={isPending}
    >
      {isPending ? "Joining..." : children || "Join"}
    </Button>
  );
}

// Usage:
// <JoinButton eventId={event.id}>Join</JoinButton>
