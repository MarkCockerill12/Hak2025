// src/server/db/insert.ts
import { db } from './index';
import { events, users, userEvents, chats } from './schema';
import { type InferInsertModel } from 'drizzle-orm';

// Define types for inserting data
export type NewEvent = InferInsertModel<typeof events>;
export type NewUser = InferInsertModel<typeof users>;
export type NewUserEvent = InferInsertModel<typeof userEvents>;
export type NewChat = InferInsertModel<typeof chats>;

// Event-related insertion functions
export async function createEvent(data: NewEvent) {
  const result = await db.insert(events).values(data).returning();
  return result[0];
}
// User-related insertion functions
export async function createUser(data: NewUser) {
  const result = await db.insert(users).values(data).returning();
  return result[0];
}


// UserEvent (join table) insertion functions
export async function assignUserToEvent(data: NewUserEvent) {
  const result = await db.insert(userEvents).values(data).returning();
  return result[0];
}


// Chat-related insertion functions
export async function createChat(data: NewChat) {
  const result = await db.insert(chats).values(data).returning();
  return result[0];
}

// Helper function for user/event join operations
export async function joinEvent(userId: string, eventId: string) {
  return await assignUserToEvent({
    userId,
    eventId,
  });
}

// Helper function for chat creation with minimal data
export async function sendChatMessage(userId: string, eventId: string, message: string) {
  return await createChat({
    userId,
    eventId,
    message,
    // dateTime, createdAt, and updatedAt will be auto-generated
  });
}
