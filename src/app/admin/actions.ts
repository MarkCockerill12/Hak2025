"use server"

import { z } from "zod"
import { createEvent } from "../../server/db/insert"
import { type Event } from "../../server/db/schema"

const eventFormSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  category: z.enum(["outdoor", "workshop", "gardening"]),
  location: z.string(),
  photo: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  volunteerLimit: z.number().int().min(0),
})

export async function createEventAction(data: z.infer<typeof eventFormSchema>) {
  try {
    // Validate input data
    const validatedData = eventFormSchema.parse(data)

    // Prepare event data for database
    const eventData: Event = {
      name: validatedData.name,
      description: validatedData.description,
      category: validatedData.category,
      location: validatedData.location,
      photo: validatedData.photo || null,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      volunteerLimit: validatedData.volunteerLimit,
    }

    // Create event in database
    const result = await createEvent(eventData)
    return result
  } catch (error) {
    console.error("Failed to create event:", error)
    throw error
  }
}
