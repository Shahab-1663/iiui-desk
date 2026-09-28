import { z } from "zod";

export const resourceMetadataSchema = z.object({
  facultySlug: z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  departmentSlug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  degreeName: z.string().trim().min(2).max(140),
  degreeLevel: z.enum(["Undergraduate", "Graduate", "Doctoral", "Other"]),
  courseCode: z.string().trim().min(2).max(32),
  courseName: z.string().trim().min(2).max(160),
  semester: z.coerce.number().int().min(1).max(16),
  kind: z.enum(["notes", "past_paper", "assignment", "study_guide", "other"]),
  title: z.string().trim().min(3).max(180),
  description: z.string().trim().max(1200).default(""),
});

export type ResourceMetadata = z.infer<typeof resourceMetadataSchema>;
