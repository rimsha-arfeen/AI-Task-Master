import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Analysis related schemas
export const analysisSchema = z.object({
  overall_score: z.number().min(0).max(100),
  breakdown: z.object({
    naming: z.number().min(0).max(10),
    modularity: z.number().min(0).max(20),
    comments: z.number().min(0).max(20),
    formatting: z.number().min(0).max(15),
    reusability: z.number().min(0).max(15),
    best_practices: z.number().min(0).max(20),
  }),
  recommendations: z.array(z.string()).min(1).max(5),
  file_name: z.string(),
  file_size: z.number(),
  file_content: z.string(),
  file_type: z.enum(["js", "jsx", "py"]),
});

export type AnalysisResult = z.infer<typeof analysisSchema>;
