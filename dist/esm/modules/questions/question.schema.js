"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionGenerateSchema = exports.questionAnswerSchema = exports.questionFetchMetadataSchema = exports.questionSendMessageSchema = exports.questionEditSchema = exports.questionReviewSchema = exports.questionUploadSchema = exports.findQuestionSchema = exports.questionMessage = void 0;
const zod_1 = require("zod");
const questionBody = zod_1.z.object({
    course: zod_1.z.string({ required_error: "A course is required" }),
    instructions: zod_1.z.string().optional(),
    examType: zod_1.z.string().default("prephouse"),
    category: zod_1.z.enum(["primary", "secondary", "tertiary"]),
    answer: zod_1.z.number({ required_error: "An answer is required" }).min(0),
    question: zod_1.z.string({ required_error: "A question is required" }),
    topic: zod_1.z.string({ required_error: "A topic is required" }),
    year: zod_1.z.string().optional(),
    options: zod_1.z
        .array(zod_1.z.string({ required_error: "A question is required" }))
        .min(2, { message: "There must be at least 2 options" }),
});
exports.questionMessage = zod_1.z.object({
    message: zod_1.z
        .string({ required_error: "A message is required" })
        .max(150, { message: "Cannot be more than 150 characters" }),
    from: zod_1.z.string({ required_error: "A sender is required" }),
});
exports.findQuestionSchema = zod_1.z.object({
    id: zod_1.z
        .string({ required_error: "a question id is required" })
        .or(zod_1.z.array(zod_1.z.string())),
    projection: zod_1.z.object({}).default({}).optional(),
    select: zod_1.z.string().optional(),
});
exports.questionUploadSchema = zod_1.z.object({
    question: questionBody,
    uploadedBy: zod_1.z.string({ required_error: "an id is needed for uploadedBy" }),
});
exports.questionReviewSchema = zod_1.z.object({
    id: zod_1.z.string({ required_error: "A question id is required" }),
    passed: zod_1.z.boolean({ required_error: "A boolean is required" }),
    message: zod_1.z.string().max(150).optional(),
    reviewerId: zod_1.z.string({ required_error: "a reviewer id is required" }),
});
exports.questionEditSchema = zod_1.z.object({
    question: questionBody,
    questionId: zod_1.z.string({ required_error: "A question id is required" }),
    editedBy: zod_1.z.string({ required_error: "editor id is required" }),
});
exports.questionSendMessageSchema = zod_1.z.object({
    questionId: zod_1.z.string({ required_error: "a question id is required" }),
    reviewerId: zod_1.z.string({ required_error: "a reviewer id is required" }),
    message: exports.questionMessage,
});
exports.questionFetchMetadataSchema = zod_1.z.object({
    action: zod_1.z.enum(["review", "upload"]),
    courses: zod_1.z.array(zod_1.z.string()).optional().default([]),
    categories: zod_1.z.array(zod_1.z.enum(["primary", "secondary", "tertiary"])),
    examTypes: zod_1.z.array(zod_1.z.string()).optional().default([]),
});
const answer = zod_1.z.object({
    questionId: zod_1.z.string({ required_error: "a question id is required" }),
    answerId: zod_1.z.string({ required_error: "an answer is required" }),
});
exports.questionAnswerSchema = zod_1.z.object({
    answers: zod_1.z.array(answer),
});
exports.questionGenerateSchema = zod_1.z.object({
    course: zod_1.z.string(),
    difficulty: zod_1.z.number().optional(),
    examType: zod_1.z.string().optional(),
    qty: zod_1.z.number().min(1).max(100, "Limit exceeded"),
});