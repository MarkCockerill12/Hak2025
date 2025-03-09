import { CalendarIcon, MessageCircle, MapPinIcon, UsersIcon, Clock } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { searchEvents } from "~/server/db/select";

type Event = {
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

async function getEvents(): Promise<Event[]> {

  const events: Event[] = await searchEvents({
    includeVolunteerCount: true,
    orderBy: 'startDate',
    orderDirection: 'desc',
  });


  return events;
}

export async function UpcomingEvents() {
  const events = await getEvents();

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Upcoming Events</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join us for our next community activities and make a difference.
            </p>
          </div>
        </div>

        <div className="my-8 mx-auto max-w-5xl">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="categories">By Category</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                {Array.from(new Set(events.map(e => e.category))).map(category => (
                  <Badge key={category} variant="outline" className="text-sm px-3 py-1 cursor-pointer hover:bg-green-100">
                    {category}
                  </Badge>
                ))}
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-center">
          <Link href="/events">
            <Button variant="outline">View All Events</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function EventCard({ event }: { event: Event }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      {event.photo && (
        <div className="relative h-48 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            {/* In production, replace with actual Image component with src from event.photo */}
            <div className="text-gray-400">Event Image</div>
          </div>
          <Badge className="absolute top-3 right-3 bg-green-600">{event.category}</Badge>
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-sm text-green-600 mb-1">
          <CalendarIcon className="h-4 w-4" />
          <span>{format(event.startDate, "MMM d, yyyy")}</span>
          <span className="text-gray-400 text-xs">
            ({formatDistanceToNow(event.startDate, { addSuffix: true })})
          </span>
        </div>
        <h3 className="text-xl font-bold">{event.name}</h3>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-gray-500 line-clamp-2">{event.description}</p>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <MapPinIcon className="h-4 w-4" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{format(event.startDate, "h:mm a")} - {format(event.endDate, "h:mm a")}</span>
          </div>

          {event.volunteerLimit && (
            <div className="flex items-center gap-1 text-gray-600">
              <UsersIcon className="h-4 w-4" />
              <span>{event.volunteerLimit} volunteers needed</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex flex-wrap gap-2">
        <Link href={`/events/${event.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
        <Link href={`/events/${event.id}/chat`}>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>Chat</span>
          </Button>
        </Link>
        <Link href={`/events/${event.id}/register`}>
          <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
            Register
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
