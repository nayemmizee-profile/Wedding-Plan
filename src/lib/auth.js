import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { z } from "zod";

const mongoUrl = process.env.MONGODB_UR_STRING;
if (!mongoUrl) {
  throw new Error("MONGODB_URL is missing.env");
}

const client = new MongoClient(mongoUrl);
const db = client.db("WEDDING_PLAN");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: true,
        validator: {
          input: z.enum(["user", "vendor"]),
          output: z.enum(["user", "vendor"]),
        },
      },
    },
  },
});
