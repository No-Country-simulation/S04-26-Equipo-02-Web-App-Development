CREATE TYPE "public"."content_type" AS ENUM('VIDEO', 'ARTICULO', 'QUIZ', 'TALLER', 'LECTURA');--> statement-breakpoint
CREATE TYPE "public"."learning_status" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."skill_category" AS ENUM('DIGITAL', 'SOCIOEMOCIONAL', 'COGNITIVO');--> statement-breakpoint
CREATE TYPE "public"."skill_level" AS ENUM('BASICO', 'INTERMEDIO', 'AVANZADO', 'EXPERTO');--> statement-breakpoint
CREATE TABLE "event_registration" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"eventId" uuid NOT NULL,
	"userId" text NOT NULL,
	"attended" boolean DEFAULT false NOT NULL,
	"registered_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learning_module" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" "skill_category" NOT NULL,
	"content_type" "content_type" DEFAULT 'LECTURA' NOT NULL,
	"duration_minutes" integer DEFAULT 30,
	"difficulty_level" integer DEFAULT 1,
	"order_in_path" integer DEFAULT 0,
	"content" text,
	"resource_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "professional_skill" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"skill_name" text NOT NULL,
	"category" "skill_category" NOT NULL,
	"level" "skill_level" DEFAULT 'BASICO' NOT NULL,
	"is_validated" boolean DEFAULT false NOT NULL,
	"validated_by" text,
	"validated_at" timestamp,
	"evidence_url" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_learning_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"moduleId" uuid NOT NULL,
	"status" "learning_status" DEFAULT 'NOT_STARTED' NOT NULL,
	"score" integer,
	"started_at" timestamp,
	"completed_at" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "speaker" text;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "max_attendees" integer;--> statement-breakpoint
ALTER TABLE "event_registration" ADD CONSTRAINT "event_registration_eventId_event_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registration" ADD CONSTRAINT "event_registration_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professional_skill" ADD CONSTRAINT "professional_skill_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_learning_progress" ADD CONSTRAINT "user_learning_progress_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_learning_progress" ADD CONSTRAINT "user_learning_progress_moduleId_learning_module_id_fk" FOREIGN KEY ("moduleId") REFERENCES "public"."learning_module"("id") ON DELETE cascade ON UPDATE no action;