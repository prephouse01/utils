import { number, string, z } from "zod";

const questionBody = z.object({
  course: z.string({ required_error: "A course is required" }),
  instructions: z.string().optional(),
  examType: z.string().default("prephouse"),
  category: z.enum(["primary", "secondary", "tertiary"]),
  answer: z.number({ required_error: "An answer is required" }).min(0),
  question: z.string({ required_error: "A question is required" }),
  topic: z.string({ required_error: "A topic is required" }),
  year: z.string().optional(),
  options: z
    .array(z.string({ required_error: "A question is required" }))
    .min(2, { message: "There must be at least 2 options" }),
});

export const questionMessage = z.object({
  message: z
    .string({ required_error: "A message is required" })
    .max(150, { message: "Cannot be more than 150 characters" }),
  from: z.string({ required_error: "A sender is required" }),
});

export const findQuestionSchema = z.object({
  id: z
    .string({ required_error: "a question id is required" })
    .or(z.array(z.string())),
  projection: z.object({}).default({}).optional(),
  select: z.string().optional(),
});

export const questionUploadSchema = z.object({
  question: questionBody,
  uploadedBy: z.string({ required_error: "an id is needed for uploadedBy" }),
});

export const questionReviewSchema = z.object({
  id: z.string({ required_error: "A question id is required" }),
  passed: z.boolean({ required_error: "A boolean is required" }),
  message: z.string().max(150).optional(),
  reviewerId: z.string({ required_error: "a reviewer id is required" }),
});

export const questionEditSchema = z.object({
  question: questionBody,
  questionId: z.string({ required_error: "A question id is required" }),
  editedBy: z.string({ required_error: "editor id is required" }),
});

export const questionSendMessageSchema = z.object({
  questionId: z.string({ required_error: "a question id is required" }),
  reviewerId: z.string({ required_error: "a reviewer id is required" }),
  message: questionMessage,
});

export const questionFetchMetadataSchema = z.object({
  action: z.enum(["review", "upload"]),
  courses: z.array(z.string()).optional().default([]),
  categories: z.array(z.enum(["primary", "secondary", "tertiary"])),
  examTypes: z.array(z.string()).optional().default([]),
});

const answer = z.object({
  questionId: z.string({ required_error: "a question id is required" }),
  answerId: z.string({ required_error: "an answer is required" }),
});

export const questionAnswerSchema = z.object({
  answers: z.array(answer),
});

export const questionGenerateSchema = z.object({
  course: z.string(),
  difficulty: z.number().optional(),
  examType: z.string().optional(),
  noOfQuestions: z.number().min(1),
});

export type FindQuestionType = z.infer<typeof findQuestionSchema>;
export type QuestionUploadType = z.infer<typeof questionUploadSchema>;
export type QuestionReviewType = z.infer<typeof questionReviewSchema>;
export type QuestionEditType = z.infer<typeof questionEditSchema>;
export type QuestionSendMessageType = z.infer<typeof questionSendMessageSchema>;
export type QuestionFetchMetadataType = z.infer<
  typeof questionFetchMetadataSchema
>;
export type QuestionAnswerType = z.infer<typeof questionAnswerSchema>;
export type QuestionGenerate = z.infer<typeof questionGenerateSchema>;
