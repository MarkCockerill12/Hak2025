// src/server/db/search.ts
import { 
  and, 
  asc, 
  between, 
  count, 
  desc, 
  eq, 
  getTableColumns, 
  gt, 
  gte, 
  ilike, 
  lt, 
  lte, 
  sql 
} from 'drizzle-orm';
import { db } from './index';
import { events, users, userEvents, chats } from './schema';

// Types for function parameters
type PaginationParams = {
  page?: number;
  pageSize?: number;
};

type EventSearchParams = PaginationParams & {
  name?: string;
  fromDate?: Date;
  toDate?: Date;
  includeVolunteerCount?: boolean;
  orderBy?: 'startDate' | 'name' | 'volunteerCount';
  orderDirection?: 'asc' | 'desc';
};

type VolunteerSearchParams = PaginationParams & {
  orderBy?: 'createdAt';
  orderDirection?: 'asc' | 'desc';
};

type ChatSearchParams = PaginationParams & {
  fromDate?: Date;
  toDate?: Date;
  messageContent?: string;
  orderBy?: 'dateTime';
  orderDirection?: 'asc' | 'desc';
};

// Event-related search functions
export async function getEventById(id: string, includeVolunteerCount = false) {
  if (includeVolunteerCount) {
    const result = await db
      .select({
        ...getTableColumns(events),
        volunteerCount: count(userEvents.userId),
      })
      .from(events)
      .leftJoin(userEvents, eq(events.id, userEvents.eventId))
      .where(eq(events.id, id))
      .groupBy(events.id);
    
    return result[0] || null;
  } else {
    const result = await db
      .select()
      .from(events)
      .where(eq(events.id, id));
    
    return result[0] || null;
  }
}

export async function searchEvents(params: EventSearchParams = {}) {
  const { 
    page = 1, 
    pageSize = 10, 
    name, 
    fromDate, 
    toDate,
    includeVolunteerCount = false,
    orderBy = 'startDate',
    orderDirection = 'asc'
  } = params;

  // Build where conditions
  const whereConditions = [];
  
  if (name) {
    whereConditions.push(ilike(events.name, `%${name}%`));
  }
  
  if (fromDate && toDate) {
    whereConditions.push(
      and(
        gte(events.startDate, fromDate),
        lte(events.endDate, toDate)
      )
    );
  } else if (fromDate) {
    whereConditions.push(gte(events.startDate, fromDate));
  } else if (toDate) {
    whereConditions.push(lte(events.endDate, toDate));
  }

  // Determine order by
  let orderByFn;
  if (orderBy === 'name') {
    orderByFn = orderDirection === 'asc' ? asc(events.name) : desc(events.name);
  } else if (orderBy === 'volunteerCount' && includeVolunteerCount) {
    // Only can order by volunteer count if we're including it
    orderByFn = orderDirection === 'asc' 
      ? asc(sql`volunteer_count`) 
      : desc(sql`volunteer_count`);
  } else {
    // Default to startDate
    orderByFn = orderDirection === 'asc' 
      ? asc(events.startDate) 
      : desc(events.startDate);
  }

  if (includeVolunteerCount) {
    const query = db
      .select({
        ...getTableColumns(events),
        volunteerCount: count(userEvents.userId),
      })
      .from(events)
      .leftJoin(userEvents, eq(events.id, userEvents.eventId))
      .groupBy(events.id)
      .orderBy(orderByFn)
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    if (whereConditions.length > 0) {
      query.where(and(...whereConditions));
    }

    return query;
  } else {
    const query = db
      .select()
      .from(events)
      .orderBy(orderByFn)
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    if (whereConditions.length > 0) {
      query.where(and(...whereConditions));
    }

    return query;
  }
}

// User-related search functions
export async function getUserEvents(
  userId: string,
  params: PaginationParams = {}
) {
  const { page = 1, pageSize = 10 } = params;

  return db
    .select({
      ...getTableColumns(events),
    })
    .from(userEvents)
    .innerJoin(events, eq(userEvents.eventId, events.id))
    .where(eq(userEvents.userId, userId))
    .orderBy(asc(events.startDate))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

// Volunteer-related search functions
export async function getEventVolunteers(
  eventId: string,
  params: VolunteerSearchParams = {}
) {
  const { 
    page = 1, 
    pageSize = 10,
    orderBy = 'createdAt',
    orderDirection = 'asc' 
  } = params;

  // Determine sort order
  const orderByFn = orderDirection === 'asc' 
    ? asc(userEvents.createdAt) 
    : desc(userEvents.createdAt);

  return db
    .select({
      userId: users.id,
      joinedAt: userEvents.createdAt,
    })
    .from(userEvents)
    .innerJoin(users, eq(userEvents.userId, users.id))
    .where(eq(userEvents.eventId, eventId))
    .orderBy(orderByFn)
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

// Chat-related search functions
export async function getEventChats(
  eventId: string,
  params: ChatSearchParams = {}
) {
  const { 
    page = 1, 
    pageSize = 20,
    fromDate,
    toDate,
    messageContent,
    orderBy = 'dateTime',
    orderDirection = 'desc'  // Default to newest first
  } = params;

  // Build where conditions
  const whereConditions = [eq(chats.eventId, eventId)];
  
  if (fromDate && toDate) {
    whereConditions.push(
      between(chats.dateTime, fromDate, toDate)
    );
  } else if (fromDate) {
    whereConditions.push(gte(chats.dateTime, fromDate));
  } else if (toDate) {
    whereConditions.push(lte(chats.dateTime, toDate));
  }

  if (messageContent) {
    whereConditions.push(ilike(chats.message, `%${messageContent}%`));
  }

  // Determine order by
  const orderByFn = orderDirection === 'asc' 
    ? asc(chats.dateTime) 
    : desc(chats.dateTime);

  return db
    .select({
      ...getTableColumns(chats),
    })
    .from(chats)
    .where(and(...whereConditions))
    .orderBy(orderByFn)
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function getUserChats(
  userId: string,
  params: ChatSearchParams = {}
) {
  const { 
    page = 1, 
    pageSize = 20,
    fromDate,
    toDate,
    messageContent,
    orderBy = 'dateTime',
    orderDirection = 'desc'  // Default to newest first
  } = params;

  // Build where conditions
  const whereConditions = [eq(chats.userId, userId)];
  
  if (fromDate && toDate) {
    whereConditions.push(
      between(chats.dateTime, fromDate, toDate)
    );
  } else if (fromDate) {
    whereConditions.push(gte(chats.dateTime, fromDate));
  } else if (toDate) {
    whereConditions.push(lte(chats.dateTime, toDate));
  }

  if (messageContent) {
    whereConditions.push(ilike(chats.message, `%${messageContent}%`));
  }

  // Determine order by
  const orderByFn = orderDirection === 'asc' 
    ? asc(chats.dateTime) 
    : desc(chats.dateTime);

  return db
    .select({
      ...getTableColumns(chats),
      eventName: events.name,
    })
    .from(chats)
    .innerJoin(events, eq(chats.eventId, events.id))
    .where(and(...whereConditions))
    .orderBy(orderByFn)
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
