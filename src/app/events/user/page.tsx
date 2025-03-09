// src/app/my-events/page.tsx
import Link from "next/link"
import { Button } from "src/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "src/components/ui/card"
import { CalendarIcon, MapIcon, MessageCircle, Users } from "lucide-react"
import { Badge } from "src/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs"
import { getUserEvents, searchEvents } from "src/server/db/select"
import { type Event } from "src/server/db/schema"
import { LeaveButton } from "./leaveButton"
import { auth } from "@clerk/nextjs/server"

export default async function MyEventsPage() {
  // Fetch all events the user has joined
  const { userId } = await auth();
  const userEvents = await getUserEvents(userId!);

  // Fetch all events with volunteer count
  const allEvents = await searchEvents({
    includeVolunteerCount: true,
    orderBy: 'startDate',
    orderDirection: 'asc'
  });

  // Filter to only include events the user has joined
  const userEventIds = new Set(userEvents.map(event => event.id));
  const myEvents = allEvents.filter(event => userEventIds.has(event.id));

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
          <p className="text-muted-foreground">Events you are participating in.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/events">
            <Button variant="outline">
              Browse More Events
            </Button>
          </Link>
          <Button className="bg-green-600 hover:bg-green-700">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Export Calendar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="outdoor">Outdoor</TabsTrigger>
          <TabsTrigger value="workshop">Workshops</TabsTrigger>
          <TabsTrigger value="gardening">Gardening</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {myEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="outdoor" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {myEvents
              .filter((event) => event.category === "outdoor")
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="workshop" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {myEvents
              .filter((event) => event.category === "workshop")
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="gardening" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {myEvents
              .filter((event) => event.category === "gardening")
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface EventCardProps {
  event: Event & { volunteerCount?: number };
}

function EventCard({ event }: EventCardProps) {
  const getBadgeVariant = (category: Event["category"]) => {
    switch (category) {
      case "outdoor":
        return "default"
      case "workshop":
        return "secondary"
      case "gardening":
        return "outline"
      default:
        return "outline"
    }
  }

  // Format the date and time
  const formatDateTime = (startDate: Date, endDate: Date) => {
    const date = startDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    const startTime = startDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
    const endTime = endDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
    return `${date} • ${startTime} - ${endTime}`;
  }

  // Calculate if event is upcoming
  const isUpcoming = new Date(event.startDate) > new Date();

  return (
    <Card className={isUpcoming ? "" : "opacity-75"}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{event.name}</CardTitle>
          <Badge variant={getBadgeVariant(event.category)}>
            {event.category}
          </Badge>
        </div>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {formatDateTime(event.startDate, event.endDate)}
            </span>
          </div>
          <div className="flex items-center">
            <MapIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{event.location}</span>
          </div>
          {event.volunteerCount !== undefined && (
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {event.volunteerCount} volunteer{event.volunteerCount !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/events/${event.id}`}>
          <Button variant="outline">View Details</Button>
        </Link>
        {isUpcoming && (
          <LeaveButton eventId={event.id}>Leave</LeaveButton>
        )}
        <Link href={`/events/${event.id}/chat`}>
          <Button variant="ghost" size="icon" aria-label="Chat about this event">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
