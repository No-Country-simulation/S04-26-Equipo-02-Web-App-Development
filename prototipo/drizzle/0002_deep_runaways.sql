ALTER TABLE "professional_profile" ADD COLUMN "headline" text;--> statement-breakpoint
ALTER TABLE "professional_profile" ADD COLUMN "summary" text;--> statement-breakpoint
ALTER TABLE "professional_profile" ADD COLUMN "linkedin_url" text;--> statement-breakpoint
ALTER TABLE "professional_profile" ADD COLUMN "portfolio_url" text;--> statement-breakpoint
ALTER TABLE "professional_profile" ADD COLUMN "certifications" text;--> statement-breakpoint
ALTER TABLE "professional_profile" ADD COLUMN "languages" text;--> statement-breakpoint
ALTER TABLE "professional_profile" ADD COLUMN "work_experience" text;--> statement-breakpoint
ALTER TABLE "professional_profile" ADD COLUMN "education" text;--> statement-breakpoint
ALTER TABLE "professional_profile" ADD COLUMN "availability_status" text DEFAULT 'disponible';--> statement-breakpoint
ALTER TABLE "professional_profile" ADD COLUMN "salary_expectation" text;--> statement-breakpoint
ALTER TABLE "professional_profile" ADD COLUMN "modality_preference" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "must_change_password" boolean DEFAULT false NOT NULL;