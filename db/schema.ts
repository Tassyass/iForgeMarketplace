import { pgTable, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  fullName: text("full_name").notNull(), // Added full name for user registration
  email: text("email").unique().notNull(), // Added email field
  password: text("password").notNull(),
  role: text("role").default("user").notNull(), // user, admin, moderator, etc.
  isAdmin: boolean("is_admin").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  last_login: timestamp("last_login"),
});

// Models Table
export const models = pgTable("models", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  modelUrl: text("model_url").notNull(),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  category: text("category").notNull(),
  status: text("status").default("pending").notNull(), // pending, approved, rejected
  directPrintEnabled: boolean("direct_print_enabled").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewNote: text("review_note"),
});

// Categories Table
export const categories = pgTable("categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").unique().notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at"),
});

// Analytics Table
export const analytics = pgTable("analytics", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  type: text("type").notNull(), // e.g., pageview, model_view, download, purchase
  modelId: integer("model_id").references(() => models.id),
  userId: integer("user_id").references(() => users.id),
  metadata: jsonb("metadata"), // Additional details (e.g., browser, IP address)
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Insert and Select Schemas for Validation
export const insertUserSchema = createInsertSchema(users, {
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
});
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

export const insertModelSchema = createInsertSchema(models, {
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  thumbnailUrl: z.string().url("Invalid thumbnail URL"),
  modelUrl: z.string().url("Invalid model URL"),
});
export const selectModelSchema = createSelectSchema(models);
export type InsertModel = z.infer<typeof insertModelSchema>;
export type Model = z.infer<typeof selectModelSchema>;

export const insertCategorySchema = createInsertSchema(categories, {
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Category slug is required"),
  description: z.string().optional(),
});
export const selectCategorySchema = createSelectSchema(categories);
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = z.infer<typeof selectCategorySchema>;

export const insertAnalyticsSchema = createInsertSchema(analytics, {
  type: z.string().min(1, "Type is required"),
  metadata: z.any().optional(),
});
export const selectAnalyticsSchema = createSelectSchema(analytics);
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = z.infer<typeof selectAnalyticsSchema>;
