CREATE TYPE "public"."application_status" AS ENUM('APPLIED', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'HIRED');--> statement-breakpoint
CREATE TYPE "public"."feedback_type" AS ENUM('INTERVIEW', 'PROFILE_REVIEW', 'GENERAL');--> statement-breakpoint
CREATE TYPE "public"."interaction_action" AS ENUM('VIEWED', 'SAVED', 'CONTACTED', 'SHORTLISTED');--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_userId" text NOT NULL,
	"to_userId" text NOT NULL,
	"job_post_id" uuid,
	"type" "feedback_type" DEFAULT 'GENERAL' NOT NULL,
	"rating" integer,
	"comment" text,
	"areas_to_improve" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_application" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_post_id" uuid NOT NULL,
	"professional_userId" text NOT NULL,
	"status" "application_status" DEFAULT 'APPLIED' NOT NULL,
	"cover_letter" text,
	"company_feedback" text,
	"feedback_at" timestamp,
	"applied_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "talent_interaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_userId" text NOT NULL,
	"professional_userId" text NOT NULL,
	"action_type" "interaction_action" NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "job_post" ADD COLUMN "company_profile_id" uuid;--> statement-breakpoint
ALTER TABLE "job_post" ADD COLUMN "skills_required" text;--> statement-breakpoint
ALTER TABLE "job_post" ADD COLUMN "modality" text;--> statement-breakpoint
ALTER TABLE "job_post" ADD COLUMN "location" text;--> statement-breakpoint
ALTER TABLE "job_post" ADD COLUMN "salary_range" text;--> statement-breakpoint
ALTER TABLE "job_post" ADD COLUMN "experience_required" text;--> statement-breakpoint
ALTER TABLE "job_post" ADD COLUMN "application_deadline" timestamp;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_from_userId_user_id_fk" FOREIGN KEY ("from_userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_to_userId_user_id_fk" FOREIGN KEY ("to_userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_job_post_id_job_post_id_fk" FOREIGN KEY ("job_post_id") REFERENCES "public"."job_post"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_application" ADD CONSTRAINT "job_application_job_post_id_job_post_id_fk" FOREIGN KEY ("job_post_id") REFERENCES "public"."job_post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_application" ADD CONSTRAINT "job_application_professional_userId_user_id_fk" FOREIGN KEY ("professional_userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "talent_interaction" ADD CONSTRAINT "talent_interaction_company_userId_user_id_fk" FOREIGN KEY ("company_userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "talent_interaction" ADD CONSTRAINT "talent_interaction_professional_userId_user_id_fk" FOREIGN KEY ("professional_userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_post" ADD CONSTRAINT "job_post_company_profile_id_company_profile_id_fk" FOREIGN KEY ("company_profile_id") REFERENCES "public"."company_profile"("id") ON DELETE no action ON UPDATE no action;