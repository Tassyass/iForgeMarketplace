import { pgTable, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  role: text("role").default("user").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
});

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
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewNote: text("review_note"),
});

export const categories = pgTable("categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").unique().notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at"),
});

export const analytics = pgTable("analytics", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  type: text("type").notNull(), // pageview, model_view, download, purchase
  modelId: integer("model_id").references(() => models.id),
  userId: integer("user_id").references(() => users.id),
  metadata: jsonb("metadata"),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

export const insertModelSchema = createInsertSchema(models);
export const selectModelSchema = createSelectSchema(models);
export type InsertModel = z.infer<typeof insertModelSchema>;
export type Model = z.infer<typeof selectModelSchema>;

export const insertCategorySchema = createInsertSchema(categories);
export const selectCategorySchema = createSelectSchema(categories);
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = z.infer<typeof selectCategorySchema>;

export const insertAnalyticsSchema = createInsertSchema(analytics);
export const selectAnalyticsSchema = createSelectSchema(analytics);
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = z.infer<typeof selectAnalyticsSchema>;
