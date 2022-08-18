import { z } from "zod";
export declare const fetchAllQuestionsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const questionUploadSchema: z.ZodObject<{
    question: z.ZodObject<{
        course: z.ZodString;
        instructions: z.ZodOptional<z.ZodString>;
        examType: z.ZodDefault<z.ZodString>;
        category: z.ZodEnum<["primary", "secondary", "tertiary"]>;
        answer: z.ZodNumber;
        question: z.ZodString;
        topic: z.ZodString;
        year: z.ZodOptional<z.ZodString>;
        options: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        year?: string | undefined;
        instructions?: string | undefined;
        course: string;
        examType: string;
        category: "primary" | "secondary" | "tertiary";
        answer: number;
        question: string;
        options: string[];
        topic: string;
    }, {
        examType?: string | undefined;
        year?: string | undefined;
        instructions?: string | undefined;
        course: string;
        category: "primary" | "secondary" | "tertiary";
        answer: number;
        question: string;
        options: string[];
        topic: string;
    }>;
    uploadedBy: z.ZodString;
}, "strip", z.ZodTypeAny, {
    question: {
        year?: string | undefined;
        instructions?: string | undefined;
        course: string;
        examType: string;
        category: "primary" | "secondary" | "tertiary";
        answer: number;
        question: string;
        options: string[];
        topic: string;
    };
    uploadedBy: string;
}, {
    question: {
        examType?: string | undefined;
        year?: string | undefined;
        instructions?: string | undefined;
        course: string;
        category: "primary" | "secondary" | "tertiary";
        answer: number;
        question: string;
        options: string[];
        topic: string;
    };
    uploadedBy: string;
}>;
export declare const questionReviewSchema: z.ZodObject<{
    id: z.ZodString;
    passed: z.ZodBoolean;
    message: z.ZodOptional<z.ZodString>;
    reviewerId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message?: string | undefined;
    id: string;
    passed: boolean;
    reviewerId: string;
}, {
    message?: string | undefined;
    id: string;
    passed: boolean;
    reviewerId: string;
}>;
export declare const questionEditSchema: z.ZodObject<{
    question: z.ZodObject<{
        course: z.ZodString;
        instructions: z.ZodOptional<z.ZodString>;
        examType: z.ZodDefault<z.ZodString>;
        category: z.ZodEnum<["primary", "secondary", "tertiary"]>;
        answer: z.ZodNumber;
        question: z.ZodString;
        topic: z.ZodString;
        year: z.ZodOptional<z.ZodString>;
        options: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        year?: string | undefined;
        instructions?: string | undefined;
        course: string;
        examType: string;
        category: "primary" | "secondary" | "tertiary";
        answer: number;
        question: string;
        options: string[];
        topic: string;
    }, {
        examType?: string | undefined;
        year?: string | undefined;
        instructions?: string | undefined;
        course: string;
        category: "primary" | "secondary" | "tertiary";
        answer: number;
        question: string;
        options: string[];
        topic: string;
    }>;
    id: z.ZodString;
    editedBy: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    question: {
        year?: string | undefined;
        instructions?: string | undefined;
        course: string;
        examType: string;
        category: "primary" | "secondary" | "tertiary";
        answer: number;
        question: string;
        options: string[];
        topic: string;
    };
    editedBy: string;
}, {
    id: string;
    question: {
        examType?: string | undefined;
        year?: string | undefined;
        instructions?: string | undefined;
        course: string;
        category: "primary" | "secondary" | "tertiary";
        answer: number;
        question: string;
        options: string[];
        topic: string;
    };
    editedBy: string;
}>;
export declare const questionSendMessageSchema: z.ZodObject<{
    questionId: z.ZodString;
    reviewerId: z.ZodString;
    message: z.ZodObject<{
        message: z.ZodString;
        from: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
        from: string;
    }, {
        message: string;
        from: string;
    }>;
}, "strip", z.ZodTypeAny, {
    message: {
        message: string;
        from: string;
    };
    reviewerId: string;
    questionId: string;
}, {
    message: {
        message: string;
        from: string;
    };
    reviewerId: string;
    questionId: string;
}>;
export declare const questionFetchMetadataSchema: z.ZodObject<{
    action: z.ZodEnum<["review", "upload"]>;
    courses: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    categories: z.ZodArray<z.ZodEnum<["primary", "secondary", "tertiary"]>, "many">;
    examTypes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    action: "review" | "upload";
    courses: string[];
    categories: ("primary" | "secondary" | "tertiary")[];
    examTypes: string[];
}, {
    courses?: string[] | undefined;
    examTypes?: string[] | undefined;
    action: "review" | "upload";
    categories: ("primary" | "secondary" | "tertiary")[];
}>;
export declare type FetchAllQuestionsType = z.infer<typeof fetchAllQuestionsSchema>;
export declare type QuestionUploadType = z.infer<typeof questionUploadSchema>;
export declare type QuestionReviewType = z.infer<typeof questionReviewSchema>;
export declare type QuestionEditType = z.infer<typeof questionEditSchema>;
export declare type QuestionSendMessageType = z.infer<typeof questionSendMessageSchema>;
export declare type QuestionFetchMetadataType = z.infer<typeof questionFetchMetadataSchema>;
