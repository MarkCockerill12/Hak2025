"use client";
import { useEffect, useState } from "react"
import { CalendarIcon, MapIcon, MessageCircle } from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { AddEventDialog } from "./add-event-dialog"
import { Button } from "~/components/ui/button"
import { type Event } from "../../server/db/schema"

// Define an event type that includes the volunteerCount property
type EventWithVolunteerCount = Event & {
  volunteerCount: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventWithVolunteerCount[]>([])

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events?includeVolunteerCount=true&orderBy=startDate&orderDirection=asc");
        if (!response.ok) throw new Error("Failed to fetch events");
        const fetchedEvents = await response.json() as EventWithVolunteerCount[];
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    }

    void fetchEvents();
  }, []);

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">Join our community events and activities.</p>
        </div>
        <div className="flex items-center gap-2">
          <AddEventDialog />
          <Button className="bg-green-600 hover:bg-green-700">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Add to Calendar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events
              .filter(event => new Date(event.startDate) > new Date())
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="past">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events
              .filter(event => new Date(event.endDate) < new Date())
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
  event: EventWithVolunteerCount;
}

function EventCard({ event }: EventCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p><MapIcon className="mr-2 h-4 w-4 inline" /> {event.location}</p>
        <p><CalendarIcon className="mr-2 h-4 w-4 inline" /> {new Date(event.startDate).toLocaleString()}</p>
        <p><CalendarIcon className="mr-2 h-4 w-4 inline" /> {new Date(event.endDate).toLocaleString()}</p>
        <p><MessageCircle className="mr-2 h-4 w-4 inline" /> {event.volunteerCount} Volunteers</p>
      </CardContent>
      <CardFooter>
        <Badge>{event.category}</Badge>
      </CardFooter>
    </Card>
  )
}
