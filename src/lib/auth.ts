import { betterAuth } from "better-auth";
import { organization, username } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema"

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    }
  }),
  plugins: [
    organization(),
    username(),
  ],
  user: {
    additionalFields: {
      dni: {
        type: "string",
        required: true,
        input: true,
      },
      enabled: {
        type: "boolean",
        required: true,
        defaultValue: true,
        input: false,
      },
      institution: {
        type: "string",
        required: false,
        input: false,
      }
    }
  }
});
