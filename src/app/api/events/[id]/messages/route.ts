// src/app/api/events/[id]/messages/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { chats, users } from '~/server/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { sendChatMessage } from '~/server/db/insert';
import { auth } from '@clerk/nextjs/server';

// GET handler to fetch messages for a specific event after a timestamp
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    const url = new URL(req.url);
    const since = url.searchParams.get('since');

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    let query = db.select().from(chats).where(eq(chats.eventId, eventId));

    // If 'since' parameter is provided, filter by dateTime
    if (since) {
      query = query.where(gt(chats.dateTime, new Date(since)));
    }

    // Order by dateTime to get newest messages last
    const messages = await query.orderBy(chats.dateTime);

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST handler to create a new message
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    const { userId, message } = await req.json();

    // Validation
    if (!eventId || !userId || !message) {
      return NextResponse.json(
        { error: 'Event ID, user ID, and message are required' },
        { status: 400 }
      );
    }

    // Authenticate the request
    const { userId: authUserId } = auth();
    if (!authUserId || authUserId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create the chat message
    const chatMessage = await sendChatMessage(userId, eventId, message);

    return NextResponse.json(chatMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
