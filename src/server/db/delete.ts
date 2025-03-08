// src/server/db/delete.ts
import { and, eq } from 'drizzle-orm';
import { db } from './index';
import { events, userEvents, chats } from './schema';

/**
 * Delete an event by ID
 * Note: This will cascade and also delete all related:
 * - userEvents (volunteer relationships)
 * - chats (messages in this event)
 * 
 * @param id Event ID
 * @returns Boolean indicating success
 */
export async function deleteEvent(id: string): Promise<boolean> {
  const result = await db
    .delete(events)
    .where(eq(events.id, id));
  
  return true; // If no error was thrown, deletion was successful
}

/**
 * Remove a volunteer (user) from an event
 * 
 * @param userId User ID
 * @param eventId Event ID
 * @returns Boolean indicating success
 */
export async function removeVolunteerFromEvent(userId: string, eventId: string): Promise<boolean> {
  const result = await db
    .delete(userEvents)
    .where(
      and(
        eq(userEvents.userId, userId),
        eq(userEvents.eventId, eventId)
      )
    );
  
  return true; // If no error was thrown, deletion was successful
}

/**
 * Delete a specific chat message
 * 
 * @param eventId Event ID
 * @param userId User ID
 * @param dateTime Original timestamp of the message
 * @returns Boolean indicating success
 */
export async function deleteChatMessage(
  eventId: string,
  userId: string,
  dateTime: Date
): Promise<boolean> {
  const result = await db
    .delete(chats)
    .where(
      and(
        eq(chats.eventId, eventId),
        eq(chats.userId, userId),
        eq(chats.dateTime, dateTime)
      )
    );
  
  return true; // If no error was thrown, deletion was successful
}
