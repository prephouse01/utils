"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMultipleCourseSchema = exports.findOneCourseSchema = exports.deleteCourseSchema = exports.editCourseSchema = exports.createCourseSchema = void 0;
const zod_1 = require("zod");
const category = zod_1.z.enum(["primary", "secondary", "tertiary"]);
const course = zod_1.z.object({
    avatar: zod_1.z.string().optional(),
    category: category,
    course: zod_1.z.string(),
    examTypes: zod_1.z.string({ required_error: "An examtype is required" }).array(),
    topics: zod_1.z.string().array(),
});
exports.createCourseSchema = course;
exports.editCourseSchema = zod_1.z.object({
    avatar: zod_1.z.string().optional(),
    category: category.optional(),
    course: zod_1.z.string().optional(),
    examTypes: zod_1.z
        .string({ required_error: "An examtype is required" })
        .array()
        .optional(),
    topics: zod_1.z.string().array().optional(),
    id: zod_1.z.string({ required_error: "An id is required" }),
});
exports.deleteCourseSchema = zod_1.z.object({
    id: zod_1.z.string({ required_error: "A course id is required" }),
});
exports.findOneCourseSchema = zod_1.z
    .object({
    course: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    id: zod_1.z.string().optional(),
}, { required_error: "No query parameters" })
    .superRefine((query, ctx) => {
    if (Object.keys(query).length === 0) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "No query parameters",
            fatal: true,
        });
    }
})
    .superRefine((query, ctx) => {
    if (query.course && !query.category) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: `No category provided for ${query.course}`,
            fatal: true,
        });
    }
})
    .superRefine((query, ctx) => {
    if (query.category && !query.course) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: `No course provided for ${query.category}`,
            fatal: true,
        });
    }
});
exports.findMultipleCourseSchema = zod_1.z.object({
    ids: zod_1.z.array(zod_1.z.string()).optional(),
    category: category.optional(),
    course: zod_1.z.array(zod_1.z.string()).optional(),
});
