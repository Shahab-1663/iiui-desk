import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  ...timestamps,
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  ...timestamps,
}, (table) => [index("session_user_idx").on(table.userId)]);

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  ...timestamps,
}, (table) => [index("account_user_idx").on(table.userId)]);

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ...timestamps,
}, (table) => [index("verification_identifier_idx").on(table.identifier)]);

export const resourceKind = pgEnum("resource_kind", ["notes", "past_paper", "assignment", "study_guide", "other"]);
export const resourceStatus = pgEnum("resource_status", ["pending", "approved", "rejected"]);

export const faculties = pgTable("faculty", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  name: varchar("name", { length: 180 }).notNull(),
  description: text("description").notNull(),
  imagePath: text("image_path").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  ...timestamps,
});

export const degrees = pgTable("degree", {
  id: uuid("id").defaultRandom().primaryKey(),
  facultyId: uuid("faculty_id").notNull().references(() => faculties.id, { onDelete: "cascade" }),
  slug: varchar("slug", { length: 100 }).notNull(),
  code: varchar("code", { length: 32 }),
  name: varchar("name", { length: 180 }).notNull(),
  level: varchar("level", { length: 32 }).notNull(),
  ...timestamps,
}, (table) => [uniqueIndex("degree_faculty_slug_idx").on(table.facultyId, table.slug)]);

export const courses = pgTable("course", {
  id: uuid("id").defaultRandom().primaryKey(),
  degreeId: uuid("degree_id").notNull().references(() => degrees.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 40 }).notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  semester: integer("semester").notNull(),
  ...timestamps,
}, (table) => [uniqueIndex("course_degree_code_idx").on(table.degreeId, table.code)]);

export const resources = pgTable("resource", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  uploadedBy: text("uploaded_by").notNull().references(() => users.id, { onDelete: "restrict" }),
  kind: resourceKind("kind").notNull(),
  status: resourceStatus("status").default("pending").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description").default("").notNull(),
  originalFilename: text("original_filename").notNull(),
  blobUrl: text("blob_url").notNull(),
  blobPath: text("blob_path").notNull(),
  contentType: varchar("content_type", { length: 128 }).notNull(),
  byteSize: integer("byte_size").notNull(),
  moderationNote: text("moderation_note"),
  ...timestamps,
}, (table) => [
  index("resource_course_status_idx").on(table.courseId, table.status),
  index("resource_status_created_idx").on(table.status, table.createdAt),
  index("resource_uploader_idx").on(table.uploadedBy),
]);

export const contactMessages = pgTable("contact_message", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  topic: varchar("topic", { length: 80 }).notNull(),
  message: text("message").notNull(),
  ...timestamps,
}, (table) => [index("contact_message_created_idx").on(table.createdAt)]);

