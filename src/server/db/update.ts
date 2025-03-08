// src/server/db/update.ts
import { and, eq } from 'drizzle-orm';
import { db } from './index';
import { events, chats } from './schema';

// Define types for updating data
type UpdateEventData = Partial<{
  name: string;
  description: string | null;
  photo: string | null;
  startDate: Date;
  endDate: Date;
  volunteerLimit: number;
}>;

type UpdateChatData = {
  message: string;
};

/**
 * Update an event's details
 * @param id Event ID
 * @param data Fields to update
 * @returns The updated event record
 */
export async function updateEvent(id: string, data: UpdateEventData) {
  const result = await db
    .update(events)
    .set(data)
    .where(eq(events.id, id))
    .returning();
  
  return result[0] || null;
}

/**
 * Update a chat message's content
 * @param eventId Event ID
 * @param userId User ID
 * @param dateTime Original timestamp of the message
 * @param data New message content
 * @returns The updated chat record
 */
export async function updateChatMessage(
  eventId: string,
  userId: string,
  dateTime: Date,
  data: UpdateChatData
) {
  const result = await db
    .update(chats)
    .set({
      message: data.message,
      // updatedAt will be automatically updated by the schema
    })
    .where(
      and(
        eq(chats.eventId, eventId),
        eq(chats.userId, userId),
        eq(chats.dateTime, dateTime)
      )
    )
    .returning();
  
  return result[0] || null;
}
