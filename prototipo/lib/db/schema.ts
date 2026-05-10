import { pgTable, text, timestamp, boolean, integer, pgEnum, uuid } from "drizzle-orm/pg-core";

// --- ENUMS ---
export const roleEnum = pgEnum("user_role", ["PROFESSIONAL", "COMPANY", "ADMIN", "SUPER_ADMIN"]);
export const eventTypeEnum = pgEnum("event_type", ["WEBINAR", "WORKSHOP", "NETWORKING", "MEETING", "CURSO"]);
export const skillCategoryEnum = pgEnum("skill_category", ["DIGITAL", "SOCIOEMOCIONAL", "COGNITIVO"]);
export const skillLevelEnum = pgEnum("skill_level", ["BASICO", "INTERMEDIO", "AVANZADO", "EXPERTO"]);
export const learningStatusEnum = pgEnum("learning_status", ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]);
export const contentTypeEnum = pgEnum("content_type", ["VIDEO", "ARTICULO", "QUIZ", "TALLER", "LECTURA"]);

// --- USER & AUTH TABLES (Better Auth Core) ---
export const users = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("emailVerified").notNull(),
	image: text("image"),
	role: roleEnum("role").default("PROFESSIONAL").notNull(),
	firstName: text("firstName"),
	lastName: text("lastName"),
	phone: text("phone"),
	location: text("location"),
	onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
	mustChangePassword: boolean("must_change_password").default(false).notNull(),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
});

export const sessions = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expiresAt").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId").notNull().references(() => users.id),
});

export const accounts = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId").notNull().references(() => users.id),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
	refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
});

export const verifications = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	createdAt: timestamp("createdAt"),
	updatedAt: timestamp("updatedAt"),
});

// --- PROJECT SPECIFIC TABLES ---

export const professionalProfiles = pgTable("professional_profile", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
	bio: text("bio"),
	title: text("title"),
	headline: text("headline"), // Professional headline (e.g. "Director de RRHH con 20 años de experiencia")
	summary: text("summary"), // Professional value proposition
	experienceYears: integer("experience_years"),
	skills: text("skills"), // Store as JSON string array
	diagnosticResults: text("diagnostic_results"), // Store as JSON string
	progress: integer("progress").default(0),
	linkedinUrl: text("linkedin_url"),
	portfolioUrl: text("portfolio_url"),
	certifications: text("certifications"), // JSON: array of { name, issuer, year }
	languages: text("languages"), // JSON: array of { language, level }
	workExperience: text("work_experience"), // JSON: array of { company, role, startYear, endYear, description }
	education: text("education"), // JSON: array of { institution, degree, field, year }
	availabilityStatus: text("availability_status").default("disponible"), // disponible | en_proceso | no_disponible
	salaryExpectation: text("salary_expectation"),
	modalityPreference: text("modality_preference"), // remoto | presencial | hibrido
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const companyProfiles = pgTable("company_profile", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
	companyName: text("company_name").notNull(),
	industry: text("industry"),
	size: text("size"),
	website: text("website"),
	description: text("description"),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const jobPosts = pgTable("job_post", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: text("userId").notNull().references(() => users.id), // The company user who posted it
	title: text("title").notNull(),
	description: text("description").notNull(),
	requirements: text("requirements"),
	status: text("status").default("active"), 
	createdAt: timestamp("createdAt").notNull().defaultNow(),
});

// --- EVENTS & CONTENT (Admin Managed) ---

export const events = pgTable("event", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	type: eventTypeEnum("type").default("WEBINAR").notNull(),
	date: timestamp("date").notNull(),
	startTime: text("start_time"), // e.g. "18:30"
	endTime: text("end_time"), // e.g. "19:30"
	speaker: text("speaker"), // Facilitador/Invitado
	zoomLink: text("zoom_link"),
	registrationLink: text("registration_link"), 
	image: text("image"), 
	isFree: boolean("isFree").default(true),
	maxAttendees: integer("max_attendees"),
	status: text("status").default("active"), 
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const userTasks = pgTable("user_task", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	category: text("category").notNull(), // e.g. "Digital", "Emotional", "Marketing"
	isCompleted: boolean("is_completed").default(false).notNull(),
	completedAt: timestamp("completed_at"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
});

// --- SPRINT 1: NEW TABLES ---

// Learning modules catalog (what's available to learn)
export const learningModules = pgTable("learning_module", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	category: skillCategoryEnum("category").notNull(),
	contentType: contentTypeEnum("content_type").default("LECTURA").notNull(),
	durationMinutes: integer("duration_minutes").default(30),
	difficultyLevel: integer("difficulty_level").default(1), // 1-3
	orderInPath: integer("order_in_path").default(0),
	content: text("content"), // Rich content or URL
	resourceUrl: text("resource_url"), // External resource link
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// User progress tracking per learning module
export const userLearningProgress = pgTable("user_learning_progress", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
	moduleId: uuid("moduleId").notNull().references(() => learningModules.id, { onDelete: "cascade" }),
	status: learningStatusEnum("status").default("NOT_STARTED").notNull(),
	score: integer("score"), // Quiz score 0-100
	startedAt: timestamp("started_at"),
	completedAt: timestamp("completed_at"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
});

// Normalized professional skills with level and validation
export const professionalSkills = pgTable("professional_skill", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
	skillName: text("skill_name").notNull(),
	category: skillCategoryEnum("category").notNull(),
	level: skillLevelEnum("level").default("BASICO").notNull(),
	isValidated: boolean("is_validated").default(false).notNull(),
	validatedBy: text("validated_by"), // Admin user id
	validatedAt: timestamp("validated_at"),
	evidenceUrl: text("evidence_url"), // Link to certificate/proof
	createdAt: timestamp("createdAt").notNull().defaultNow(),
});

// Event registrations (user signs up for events)
export const eventRegistrations = pgTable("event_registration", {
	id: uuid("id").defaultRandom().primaryKey(),
	eventId: uuid("eventId").notNull().references(() => events.id, { onDelete: "cascade" }),
	userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
	attended: boolean("attended").default(false).notNull(),
	registeredAt: timestamp("registered_at").notNull().defaultNow(),
});
