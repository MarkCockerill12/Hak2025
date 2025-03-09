'use server'

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { removeVolunteerFromEvent } from "../../../server/db/delete"

/**
 * Server action to remove a user from an event
 */
export async function leaveEvent(eventId: string) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized: You must be logged in to leave an event")
  }

  // Use the existing function to remove the user from the event
  await removeVolunteerFromEvent(userId, eventId)

  // Revalidate the events pages to update the UI
  revalidatePath('/events/user')
  revalidatePath('/events')

  return { success: true }
}
