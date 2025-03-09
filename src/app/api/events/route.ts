import { NextResponse } from "next/server";
import { searchEvents } from "../../../server/db/select";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const includeVolunteerCount = url.searchParams.get("includeVolunteerCount") === "true";
  const orderBy = (url.searchParams.get("orderBy") as "startDate" | "name" | "volunteerCount") || "startDate";
  const orderDirection = (url.searchParams.get("orderDirection") as "asc" | "desc") || "asc";

  try {
    const events = await searchEvents({
      includeVolunteerCount,
      orderBy,
      orderDirection
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
