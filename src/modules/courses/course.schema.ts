import { z } from "zod";

const category = z.enum(["primary", "secondary", "tertiary;"]);
const course = z.object({
  avatar: z.string().optional(),
  category: category,
  course: z.string(),
  examTypes: z.string({ required_error: "An examtype is required" }).array(),
  topics: z.string().array(),
});

export const createCourseSchema = course;

export const editCourseSchema = course.merge(
  z.object({ id: z.string({ required_error: "An id is required" }) })
);

export const deleteCourseSchema = z.object({
  id: z.string({ required_error: "A course id is required" }),
});

export const findOneCourseSchema = z.object({
  id: z.string().optional(),
  category: category.optional(),
  course: z.string().optional(),
});

export type CreateCourseType = z.infer<typeof createCourseSchema>;
export type EditCourseType = z.infer<typeof editCourseSchema>;
export type DeleteCourseType = z.infer<typeof deleteCourseSchema>;
export type FindOneCourseType = z.infer<typeof findOneCourseSchema>;
