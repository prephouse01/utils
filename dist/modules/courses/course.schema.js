"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourseSchema = exports.editCourseSchema = exports.createCourseSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const category = zod_1.default.enum(["primary", "secondary", "tertiary;"]);
const course = zod_1.default.object({
    avatar: zod_1.default.string().optional(),
    category: category,
    course: zod_1.default.string(),
    examTypes: zod_1.default.string({ required_error: "An examtype is required" }).array(),
    topics: zod_1.default.string().array(),
});
exports.createCourseSchema = course;
exports.editCourseSchema = course.merge(zod_1.default.object({ id: zod_1.default.string({ required_error: "An id is required" }) }));
exports.deleteCourseSchema = zod_1.default.object({
    id: zod_1.default.string({ required_error: "A course id is required" }),
});
