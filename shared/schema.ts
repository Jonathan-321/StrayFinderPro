import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Dog report schema
export const dogs = pgTable("dogs", {
  id: serial("id").primaryKey(),
  breed: text("breed"),
  color: text("color").notNull(),
  description: text("description").notNull(),
  imageUrls: text("image_urls").array().notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  dateFound: text("date_found").notNull(),
  timeFound: text("time_found").notNull(),
  status: text("status").notNull().default("active"),
  finderName: text("finder_name").notNull(),
  finderPhone: text("finder_phone").notNull(),
  finderEmail: text("finder_email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User schema for admin access
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

// Insert schemas
export const insertDogSchema = createInsertSchema(dogs)
  .omit({ id: true, createdAt: true, status: true });

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, isAdmin: true });

// Field validation extensions for front-end form validation
export const dogReportSchema = insertDogSchema.extend({
  breed: z.string().optional(),
  color: z.string().min(1, { message: "Color is required" }),
  description: z.string().min(10, { message: "Please provide a detailed description (at least 10 characters)" }),
  imageUrls: z.array(z.string()).min(1, { message: "Please upload at least one image" }),
  address: z.string().min(3, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  latitude: z.string().min(1, { message: "Please mark the location on the map" }),
  longitude: z.string().min(1, { message: "Please mark the location on the map" }),
  dateFound: z.string().min(1, { message: "Date found is required" }),
  timeFound: z.string().min(1, { message: "Approximate time is required" }),
  finderName: z.string().min(2, { message: "Your name is required" }),
  finderPhone: z.string().min(7, { message: "Valid phone number is required" }),
  finderEmail: z.string().email({ message: "Valid email is required" }),
});

// Export types
export type InsertDog = z.infer<typeof insertDogSchema>;
export type Dog = typeof dogs.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
