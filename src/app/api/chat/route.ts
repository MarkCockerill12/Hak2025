// src/app/api/chat/route.ts
import { NextResponse } from "next/server";
import { sendChatMessage } from "~/server/db/insert";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs/server";

// Schema for request validation
const messageSchema = z.object({
  eventId: z.string().uuid(),
  message: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    // Get authenticated user
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate request body
    const result = messageSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request", details: result.error.format() },
        { status: 400 }
      );
    }

    // Extract validated data
    const { eventId, message } = result.data;

    // Send the chat message
    const chatMessage = await sendChatMessage(
      userId,
      eventId,
      message
    );

    // Return the created message
    return NextResponse.json(chatMessage, { status: 201 });

  } catch (error) {
    console.error("Error posting chat message:", error);
    return NextResponse.json(
      { error: "Failed to post message" },
      { status: 500 }
    );
  }
}
