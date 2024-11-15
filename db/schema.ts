import { pgTable, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  role: text("role").default("user").notNull(),
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
  directPrintEnabled: boolean("direct_print_enabled").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  modelId: integer("model_id").references(() => models.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  status: text("status").default("pending").notNull(),
  printOptions: jsonb("print_options"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

export const insertModelSchema = createInsertSchema(models);
export const selectModelSchema = createSelectSchema(models);
export type InsertModel = z.infer<typeof insertModelSchema>;
export type Model = z.infer<typeof selectModelSchema>;

export const insertOrderSchema = createInsertSchema(orders);
export const selectOrderSchema = createSelectSchema(orders);
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = z.infer<typeof selectOrderSchema>;
