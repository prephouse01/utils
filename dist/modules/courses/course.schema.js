"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOneCourseSchema = exports.deleteCourseSchema = exports.editCourseSchema = exports.createCourseSchema = void 0;
const zod_1 = require("zod");
const category = zod_1.z.enum(["primary", "secondary", "tertiary;"]);
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
exports.findOneCourseSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    category: category.optional(),
    course: zod_1.z.string().optional(),
});
