import { z } from "zod";

const category = z.enum(["primary", "secondary", "tertiary"]);
const course = z.object({
  avatar: z.string().optional(),
  category: category,
  course: z.string(),
  examTypes: z.string({ required_error: "An examtype is required" }).array(),
  topics: z.string().array(),
});

export const createCourseSchema = course;

export const editCourseSchema = z.object({
  avatar: z.string().optional(),
  category: category.optional(),
  course: z.string().optional(),
  examTypes: z
    .string({ required_error: "An examtype is required" })
    .array()
    .optional(),
  topics: z.string().array().optional(),
  id: z.string({ required_error: "An id is required" }),
});

export const deleteCourseSchema = z.object({
  id: z.string({
    required_error: "A course id is required",
    invalid_type_error: "id should be a string",
  }),
});

export const findOneCourseSchema = z
  .object(
    {
      course: z
        .string({ invalid_type_error: "course should be a string" })
        .optional(),
      category: z.string().optional(),
      id: z.string({ invalid_type_error: "id should be a string" }).optional(),
    },
    { required_error: "No query parameters" }
  )
  .superRefine((query, ctx) => {
    if (Object.keys(query).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "No query parameters",
        fatal: true,
      });
    }
  })
  .superRefine((query, ctx) => {
    if (query.course && !query.category) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `No category provided for ${query.course}`,
        fatal: true,
      });
    }
  })
  .superRefine((query, ctx) => {
    if (query.category && !query.course) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `No course provided for ${query.category}`,
        fatal: true,
      });
    }
  });

export const findMultipleCourseSchema = z.object({
  ids: z
    .array(z.string({ invalid_type_error: "ids should be a string" }), {
      invalid_type_error: "ids should be an array of strings",
    })
    .optional(),
  category: category.optional(),
  course: z
    .array(z.string({ invalid_type_error: "course should be a string" }), {
      invalid_type_error: "course should be an array of string",
    })
    .optional(),
});

export type CreateCourseType = z.infer<typeof createCourseSchema>;
export type EditCourseType = z.infer<typeof editCourseSchema>;
export type DeleteCourseType = z.infer<typeof deleteCourseSchema>;
export type FindOneCourseType = z.infer<typeof findOneCourseSchema>;
export type FindMultipleCourseType = z.infer<typeof findMultipleCourseSchema>;
