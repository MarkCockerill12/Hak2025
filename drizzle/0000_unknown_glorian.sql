CREATE TABLE IF NOT EXISTS "hack2025_chat" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"date_time" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hack2025_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"photo" varchar(512),
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"volunteer_limit" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hack2025_user_event" (
	"user_id" varchar(256) NOT NULL,
	"event_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "hack2025_user_event_user_id_event_id_pk" PRIMARY KEY("user_id","event_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hack2025_user" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hack2025_chat" ADD CONSTRAINT "hack2025_chat_event_id_hack2025_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."hack2025_event"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hack2025_chat" ADD CONSTRAINT "hack2025_chat_user_id_hack2025_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."hack2025_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hack2025_user_event" ADD CONSTRAINT "hack2025_user_event_user_id_hack2025_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."hack2025_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hack2025_user_event" ADD CONSTRAINT "hack2025_user_event_event_id_hack2025_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."hack2025_event"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_event_idx" ON "hack2025_chat" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_user_idx" ON "hack2025_chat" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_datetime_idx" ON "hack2025_chat" USING btree ("date_time");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_name_idx" ON "hack2025_event" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_date_idx" ON "hack2025_event" USING btree ("start_date","end_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_event_user_idx" ON "hack2025_user_event" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_event_event_idx" ON "hack2025_user_event" USING btree ("event_id");