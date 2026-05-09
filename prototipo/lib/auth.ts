import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: schema.users,
            session: schema.sessions,
            account: schema.accounts,
            verification: schema.verifications,
        }
    }),

    plugins: [
        nextCookies(),
    ],

    emailAndPassword: {
        enabled: true,
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "PROFESSIONAL",
            },
            firstName: {
                type: "string",
                required: false,
            },
            lastName: {
                type: "string",
                required: false,
            },
            phone: {
                type: "string",
                required: false,
            },
            location: {
                type: "string",
                required: false,
            },
            onboardingCompleted: {
                type: "boolean",
                required: false,
                defaultValue: false,
            },
        },
    },
});
