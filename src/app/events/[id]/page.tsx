import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "~/components/ui/card";
import { getEventById, getEventVolunteers, getEventChats } from "~/server/db/select";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { CalendarIcon, MapPinIcon, InfoIcon, Users, SendIcon } from "lucide-react";
import { Suspense } from "react";
import { db } from "~/server/db";
import { chats } from "~/server/db/schema";
import { revalidatePath } from "next/cache";
import type { User } from "@clerk/nextjs/server";

type EventInfo = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  location: string;
  photo: string | null;
  startDate: Date;
  endDate: Date;
  volunteerLimit: number | null;
  createdAt: Date;
  updatedAt: Date | null;
};

type Volunteer = {
  userId: string;
  joinedAt: Date;
};

type EventPageProps = Promise<{ id: string }>;

// Interface for simplified user data
interface UserData {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  imageUrl: string | null;
}

// Server component for rendering chat messages
async function ChatMessages({ eventId }: { eventId: string }) {
  const messages = await getEventChats(eventId, {
    orderDirection: 'asc', // Show oldest messages first
    pageSize: 50 // Get a reasonable number of messages
  });

  const user = await currentUser();

  if (!messages || messages.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No messages yet. Be the first to start the conversation!</p>
      </div>
    );
  }

  // Get user data for all messages to display names
  const userIds = [...new Set(messages.map(msg => msg.userId))];
  const clerk = await clerkClient();
  const users = await Promise.all(
    userIds.map(async id => {
      try {
        return await clerk.users.getUser(id);
      } catch (error) {
        console.error(`Failed to fetch user ${id}:`, error);
        return null;
      }
    })
  );

  // Create a map of users with proper typing
  const userMap = users.reduce<Record<string, UserData>>((acc, user) => {
    if (user) {
      acc[user.id] = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        imageUrl: user.imageUrl
      };
    }
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {messages.map((message, index) => {
        const isCurrentUser = message.userId === user?.id;
        const messageUser = userMap[message.userId];
        const userName = messageUser?.firstName || 'Unknown User';

        return (
          <div
            key={`${message.userId}-${message.dateTime.getTime()}-${index}`}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-lg px-4 py-2 ${isCurrentUser
                ? 'bg-green-100 text-green-800 rounded-br-none'
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
            >
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs font-medium text-gray-600">
                  {isCurrentUser ? 'You' : userName}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(message.dateTime, { addSuffix: true })}
                </span>
              </div>
              <p className="break-words">{message.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Chat form server action
async function submitChatMessage(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  'use server'

  const eventId = formData.get('eventId') as string;
  const userId = formData.get('userId') as string;
  const message = formData.get('message') as string;

  if (!eventId || !userId || !message.trim()) {
    return { error: 'Missing required fields' };
  }

  try {
    await db.insert(chats).values({
      eventId,
      userId,
      message: message.trim(),
      dateTime: new Date()
    });

    revalidatePath(`/events/${eventId}`);
    return { success: true };
  } catch (error) {
    console.error('Error posting chat message:', error);
    return { error: 'Failed to post message' };
  }
}

export default async function EventPage({ params }: { params: EventPageProps }) {
  const { id } = await params;
  const user = await currentUser();

  try {
    const client = await clerkClient();
    const eventInfo: EventInfo | null = await getEventById(id);

    if (!eventInfo) {
      return (
        <div className="container flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <InfoIcon className="w-12 h-12 mx-auto text-gray-400" />
                <h2 className="text-2xl font-bold">Event Not Found</h2>
                <p className="text-gray-500">The event you are looking for does not exist or has been removed.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    const volunteers: Volunteer[] = await getEventVolunteers(id);
    const users = await Promise.all(
      volunteers.map(async (vol) => {
        return client.users.getUser(vol.userId);
      })
    );

    return (
      <div className="container py-10 max-w-4xl mx-auto">
        <Card className="shadow-lg border-0 overflow-hidden">
          {eventInfo.photo && (
            <div className="relative w-full h-64">
              <Image
                src={eventInfo.photo}
                alt={eventInfo.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">{eventInfo.name}</CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {eventInfo.category}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="prose max-w-none">
              <p>{eventInfo.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPinIcon className="w-5 h-5 text-gray-500" />
                <span>{eventInfo.location}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Users className="w-5 h-5 text-gray-500" />
                <span>
                  {volunteers.length} / {eventInfo.volunteerLimit ?? '∞'} volunteers
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <CalendarIcon className="w-5 h-5 text-gray-500" />
                <span>Starts: {format(new Date(eventInfo.startDate), 'PPP')}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <CalendarIcon className="w-5 h-5 text-gray-500" />
                <span>Ends: {format(new Date(eventInfo.endDate), 'PPP')}</span>
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Volunteers ({volunteers.length})</h3>

              {volunteers.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex flex-col items-center text-center">
                      <Avatar className="w-16 h-16 mb-2">
                        <AvatarImage src={user?.imageUrl || ''} alt={user?.fullName || ''} />
                        <AvatarFallback className="text-lg">
                          {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium truncate max-w-full">
                        {user?.fullName}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No volunteers have joined yet.</p>
              )}
            </div>

            {/* Chat Section - Added below volunteers */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Discussion</h3>

              <div className="bg-white rounded-lg border border-gray-200">
                <div className="h-[40vh] flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4">
                    <Suspense fallback={<div className="py-4 text-center">Loading messages...</div>}>
                      <ChatMessages eventId={id} />
                    </Suspense>
                  </div>

                  {user && (
                    <div className="border-t border-gray-200 p-4">
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault(); // Prevent the default form submission
                          const form = e as unknown as HTMLFormElement; // Cast the event to a form element
                          const formData = new FormData(form); // Get form data
                          await submitChatMessage(formData); // Call the async function
                        }}
                        className="flex gap-2"
                      >
                        <input type="hidden" name="eventId" value={id} />
                        <input type="hidden" name="userId" value={user.id} />
                        <input
                          type="text"
                          name="message"
                          placeholder="Type your message..."
                          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                        <button
                          type="submit"
                          className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                        >
                          <SendIcon className="h-5 w-5" />
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Error loading event:", error);
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <InfoIcon className="w-12 h-12 mx-auto text-red-400" />
              <h2 className="text-2xl font-bold">Something Went Wrong</h2>
              <p className="text-gray-500">We could not load this event. Please try again later.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
