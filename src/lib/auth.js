import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { z } from "zod";

const mongoUrl = process.env.MONGODB_UR_STRING;

if (!mongoUrl) {
  throw new Error("MONGODB_UR_STRING is missing.");
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
      accountType: {
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

  plugins: [
    admin({
      adminUserIds: (process.env.ADMIN_USER_IDS || "")
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean),
    }),
  ],
});
