import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { CalendarIcon, MapPin, MessageCircle, Users } from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"

// Define proper types for events
interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  category: "outdoor" | "workshop" | "gardening"
  participants: number
  maxParticipants: number
}

// Move mock data outside the component for better performance
const events: Event[] = [
  {
    id: 1,
    title: "Nature Walk for Kids",
    description: "Join us for a guided nature walk designed for children to explore and learn about local wildlife.",
    date: "June 11, 2025",
    time: "10:00 AM - 12:00 PM",
    location: "Holyrood Park, Edinburgh",
    category: "outdoor",
    participants: 15,
    maxParticipants: 20,
  },
  {
    id: 2,
    title: "Community Garden Day",
    description: "Help us plant and maintain our community garden. All ages welcome!",
    date: "June 15, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Leith Community Garden",
    category: "gardening",
    participants: 8,
    maxParticipants: 15,
  },
  {
    id: 3,
    title: "Environmental Workshop",
    description: "Learn about sustainability and how to reduce your carbon footprint.",
    date: "June 18, 2025",
    time: "6:00 PM - 8:00 PM",
    location: "Edinburgh Central Library",
    category: "workshop",
    participants: 12,
    maxParticipants: 30,
  },
  {
    id: 4,
    title: "Beach Cleanup",
    description: "Join our team to clean up Portobello Beach and protect marine life.",
    date: "June 20, 2025",
    time: "9:00 AM - 12:00 PM",
    location: "Portobello Beach",
    category: "outdoor",
    participants: 25,
    maxParticipants: 40,
  },
  {
    id: 5,
    title: "Nature Photography Class",
    description: "Learn how to capture the beauty of nature through photography.",
    date: "June 25, 2025",
    time: "3:00 PM - 5:00 PM",
    location: "Royal Botanic Garden",
    category: "workshop",
    participants: 10,
    maxParticipants: 15,
  },
  {
    id: 6,
    title: "Youth Environmental Leadership",
    description: "A workshop for teenagers interested in environmental advocacy and leadership.",
    date: "June 28, 2025",
    time: "1:00 PM - 4:00 PM",
    location: "Edinburgh University",
    category: "workshop",
    participants: 18,
    maxParticipants: 25,
  },
]

export default function EventsPage() {
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

// Add proper type for EventCard component props
interface EventCardProps {
  event: Event
}

function EventCard({ event }: EventCardProps) {
  // Helper function to determine badge variant based on category
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{event.title}</CardTitle>
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
              {event.date} • {event.time}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {event.participants} / {event.maxParticipants} participants
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/events/${event.id}`}>
          <Button variant="outline">View Details</Button>
        </Link>
        <Link href={`/events/${event.id}/chat`}>
          <Button variant="ghost" size="icon" aria-label="Chat about this event">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}