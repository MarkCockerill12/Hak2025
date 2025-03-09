// FILE: src/pages/api/event/[id].ts
import { type NextApiRequest, type NextApiResponse } from 'next';
import { getEventById, getEventVolunteers } from '../../../server/db/select';
import { auth } from "@clerk/nextjs/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { userId } = await auth();

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  const event = await getEventById(id);

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const participants = await getEventVolunteers(id);

  res.status(200).json({ event, participants });
}
