ALTER TABLE "hack2025_user_event" DROP CONSTRAINT "hack2025_user_event_user_id_hack2025_user_id_fk";
--> statement-breakpoint
ALTER TABLE "hack2025_event" ADD COLUMN "category" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hack2025_user_event" ADD CONSTRAINT "hack2025_user_event_user_id_hack2025_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."hack2025_user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
