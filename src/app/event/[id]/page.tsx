import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "~/components/ui/card";
import { getEventById, getEventVolunteers } from "~/server/db/select";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { format } from "date-fns";
import Image from "next/image";
import { auth, clerkClient } from "@clerk/nextjs/server";

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

export default async function EventPage({ params }: { params: { id: string } }) {

  const { id } = params;
  const client = await clerkClient();

  const eventInfo: EventInfo | null = await getEventById(id);
  const volunteers: Volunteer[] = await getEventVolunteers(id);

  const users = await Promise.all(
    volunteers.map(async (vol) => {
      return client.users.getUser(vol.userId);
    })
  );

  if (!eventInfo) {
    return <div>Event not found</div>;
  }

  return (
    <div className="container p-10">
      <Card>
        <CardHeader>
          <CardTitle>{eventInfo?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {eventInfo.photo && <Image src={eventInfo.photo} alt={eventInfo.name} className="w-full h-64 object-cover mb-4" />}
          <p><strong>Description:</strong> {eventInfo.description}</p>
          <p><strong>Category:</strong> {eventInfo.category}</p>
          <p><strong>Location:</strong> {eventInfo.location}</p>
          <p><strong>Start Date:</strong> {format(new Date(eventInfo.startDate), 'PPP')}</p>
          <p><strong>End Date:</strong> {format(new Date(eventInfo.endDate), 'PPP')}</p>
          <p><strong>Volunteer Limit:</strong> {eventInfo.volunteerLimit ?? 'No limit'}</p>
        </CardContent>
        <CardFooter>
          <h3 className="text-lg font-semibold mb-4">Volunteers</h3>
          <div className="flex flex-wrap">
            {users.map((user) => {
              return (
                <div key={user.id} className="flex items-center mb-4 mr-4">
                  <Avatar>
                    <AvatarImage src={user?.imageUrl || ''} alt={user?.fullName || ''} />
                    <AvatarFallback>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-2">
                    <p>{user?.fullName}</p>
                  </div>
                </div>
              )
            }
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
