import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  timestamp,
  varchar,
  text,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Multi-project schema creator with prefix 'hack2025_'
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `hack2025_${name}`);

// Event table
export const events = createTable(
  "event",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    category: text("category").notNull(),
    location: text("location").notNull(),
    photo: varchar("photo", { length: 512 }),
    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true }).notNull(),
    volunteerLimit: integer("volunteer_limit").default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (table) => ({
    nameIndex: index("event_name_idx").on(table.name),
    dateIndex: index("event_date_idx").on(table.startDate, table.endDate),
  })
);

// User table (using Clerk for auth, so we just store the Clerk ID)
export const users = createTable(
  "user",
  {
    id: varchar("id", { length: 256 }).primaryKey(), // Clerk ID as primary key
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  }
);

// Event-User join table for tracking which users are assigned to which events
export const userEvents = createTable(
  "user_event",
  {
    userId: varchar("user_id", { length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: "set null" }),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    compoundKey: primaryKey({ columns: [table.userId, table.eventId] }),
    userIdIdx: index("user_event_user_idx").on(table.userId),
    eventIdIdx: index("user_event_event_idx").on(table.eventId),
  })
);

// Chats table
export const chats = createTable(
  "chat",
  {

    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    dateTime: timestamp("date_time", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    message: text("message").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (table) => ({
    eventIdIdx: index("chat_event_idx").on(table.eventId),
    userIdIdx: index("chat_user_idx").on(table.userId),
    dateTimeIdx: index("chat_datetime_idx").on(table.dateTime),
  })
);


export type Event = InferInsertModel<typeof events>;
export type User = InferInsertModel<typeof users>;
export type UserEvent = InferInsertModel<typeof userEvents>;
export type Chat = InferInsertModel<typeof chats>;
