// src/app/api/chat/messages/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getEventChats } from "~/server/db/select";
import { currentUser } from "@clerk/nextjs/server";

// Define the request schema
const querySchema = z.object({
  eventId: z.string().uuid(),
  page: z.coerce.number().positive().optional().default(1),
  pageSize: z.coerce.number().positive().optional().default(50),
});

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await currentUser();
    const userId = user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get("eventId");
    const page = searchParams.get("page");
    const pageSize = searchParams.get("pageSize");

    const queryResult = querySchema.safeParse({
      eventId,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    });

    if (!queryResult.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: queryResult.error.format() },
        { status: 400 }
      );
    }

    const { eventId: validatedEventId, page: validatedPage, pageSize: validatedPageSize } = queryResult.data;

    // Fetch messages from database
    const messages = await getEventChats(validatedEventId, {
      page: validatedPage,
      pageSize: validatedPageSize,
      orderBy: "dateTime",
      orderDirection: "asc", // Chronological order for chat messages
    });

    // Format the response
    const formattedMessages = messages.map(message => ({
      id: message.id,
      userId: message.userId,
      eventId: message.eventId,
      message: message.message,
      createdAt: message.dateTime.toISOString(),
      // We don't have user details in the chats table, so we'll need to fetch user info separately
      user: {
        id: message.userId,
        // The rest will be populated by the client side
      }
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
