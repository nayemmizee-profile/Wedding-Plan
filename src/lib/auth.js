import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { z } from "zod";

// MongoDB URL
const mongoUrl = process.env.MONGODB_UR_STRING;

if (!mongoUrl) {
  throw new Error("MONGODB_UR_STRING is missing.");
}

// Reuse MongoDB client across requests in the same runtime
const globalForMongo = globalThis;

const client = globalForMongo.mongoClient || new MongoClient(mongoUrl);

globalForMongo.mongoClient = client;

// Database
const db = client.db("WEDDING_PLAN");

// Better Auth Configuration
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  // Google Login
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    },
  },

  // MongoDB Adapter
  database: mongodbAdapter(db, {
    client,
  }),

  // Email and Password Login
  emailAndPassword: {
    enabled: true,
  },

  // Additional User Fields
  user: {
    additionalFields: {
      accountType: {
        type: "string",
        required: true,
        defaultValue: "user",
        input: true,
        validator: {
          input: z.enum(["user", "vendor"]),
          output: z.enum(["user", "vendor"]),
        },
      },
    },
  },

  // Admin Plugin
  plugins: [
    admin({
      adminUserIds: (process.env.ADMIN_USER_IDS || "")
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean),
    }),
  ],
});
