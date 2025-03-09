// src/app/events/page.tsx
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { CalendarIcon, MapIcon, MessageCircle } from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { searchEvents, getUserEvents } from "../../server/db/select"
import { type Event } from "../../server/db/schema"
import { JoinButton } from "./joinButton"
import { auth } from "@clerk/nextjs/server"
export default async function EventsPage() {
  // Fetch all events with volunteer count 
  const { userId } = await auth();
  const userEvents = await getUserEvents(userId!)
  const allEvents = await searchEvents({
    includeVolunteerCount: true,
    orderBy: 'startDate',
    orderDirection: 'asc'
  });

  // Create a Set of event IDs that the user has already joined for efficient lookup
  const userEventIds = new Set(userEvents.map(event => event.id));

  // Filter out events the user has already joined
  const events = allEvents.filter(event => !userEventIds.has(event.id));



  return (
    <div className="container py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">Join our community events and activities.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-green-600 hover:bg-green-700">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Add to Calendar
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
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="outdoor" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events
              .filter((event) => event.category === "outdoor")
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="workshop" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events
              .filter((event) => event.category === "workshop")
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="gardening" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events
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
  event: Event
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

  return (
    <Card>
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
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/events/${event.id}`}>
          <Button variant="outline">View Details</Button>
        </Link>
        <JoinButton eventId={event.id}>Join</JoinButton>
        <Link href={`/events/${event.id}/chat`}>
          <Button variant="ghost" size="icon" aria-label="Chat about this event">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )






}
