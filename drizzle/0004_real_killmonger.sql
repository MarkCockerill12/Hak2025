DROP INDEX IF EXISTS "chat_event_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "chat_user_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "chat_datetime_idx";--> statement-breakpoint
ALTER TABLE "hack2025_chat" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;