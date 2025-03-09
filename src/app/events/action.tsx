// First, create the server action
// src/server/actions.ts
"use server"

import { auth } from "@clerk/nextjs/server";
import { joinEvent } from "~/server/db/insert"; // adjust the path as needed
import { createUser } from "~/server/db/insert";
export async function joinEventAction(eventId: string) {
  const { userId } = await auth();
  console.log(userId)
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    // Try to create the user first using your existing createUser function
    await createUser({
      id: userId,
      // Add any other required fields with default values
    });
  } catch (error) {
    // Ignore error - user likely already exists
    console.log("User might already exist:", error);
  }

  return joinEvent(userId, eventId);
}



// Then in your EventCard component, simply use:
// <JoinButton eventId={event.id} />
