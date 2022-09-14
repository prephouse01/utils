import { z } from "zod";
export declare const questionMessage: z.ZodObject<{
    message: z.ZodString;
    from: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    from: string;
}, {
    message: string;
    from: string;
}>;
export declare const findQuestionSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
    projection: z.ZodOptional<z.ZodDefault<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>>;
    select: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projection?: {} | undefined;
    select?: string | undefined;
    id: string | string[];
}, {
    projection?: {} | undefined;
    select?: string | undefined;
    id: string | string[];
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
        instructions?: string | undefined;
        year?: string | undefined;
        course: string;
        examType: string;
        category: "primary" | "secondary" | "tertiary";
        options: string[];
        answer: number;
        question: string;
        topic: string;
    }, {
        instructions?: string | undefined;
        examType?: string | undefined;
        year?: string | undefined;
        course: string;
        category: "primary" | "secondary" | "tertiary";
        options: string[];
        answer: number;
        question: string;
        topic: string;
    }>;
    uploadedBy: z.ZodString;
}, "strip", z.ZodTypeAny, {
    question: {
        instructions?: string | undefined;
        year?: string | undefined;
        course: string;
        examType: string;
        category: "primary" | "secondary" | "tertiary";
        options: string[];
        answer: number;
        question: string;
        topic: string;
    };
    uploadedBy: string;
}, {
    question: {
        instructions?: string | undefined;
        examType?: string | undefined;
        year?: string | undefined;
        course: string;
        category: "primary" | "secondary" | "tertiary";
        options: string[];
        answer: number;
        question: string;
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
        instructions?: string | undefined;
        year?: string | undefined;
        course: string;
        examType: string;
        category: "primary" | "secondary" | "tertiary";
        options: string[];
        answer: number;
        question: string;
        topic: string;
    }, {
        instructions?: string | undefined;
        examType?: string | undefined;
        year?: string | undefined;
        course: string;
        category: "primary" | "secondary" | "tertiary";
        options: string[];
        answer: number;
        question: string;
        topic: string;
    }>;
    questionId: z.ZodString;
    editedBy: z.ZodString;
}, "strip", z.ZodTypeAny, {
    question: {
        instructions?: string | undefined;
        year?: string | undefined;
        course: string;
        examType: string;
        category: "primary" | "secondary" | "tertiary";
        options: string[];
        answer: number;
        question: string;
        topic: string;
    };
    questionId: string;
    editedBy: string;
}, {
    question: {
        instructions?: string | undefined;
        examType?: string | undefined;
        year?: string | undefined;
        course: string;
        category: "primary" | "secondary" | "tertiary";
        options: string[];
        answer: number;
        question: string;
        topic: string;
    };
    questionId: string;
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
export declare const questionAnswerSchema: z.ZodObject<{
    answers: z.ZodArray<z.ZodObject<{
        questionId: z.ZodString;
        answerId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        questionId: string;
        answerId: string;
    }, {
        questionId: string;
        answerId: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    answers: {
        questionId: string;
        answerId: string;
    }[];
}, {
    answers: {
        questionId: string;
        answerId: string;
    }[];
}>;
export declare const questionGenerateSchema: z.ZodObject<{
    course: z.ZodString;
    difficulty: z.ZodOptional<z.ZodNumber>;
    examType: z.ZodOptional<z.ZodString>;
    qty: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    examType?: string | undefined;
    difficulty?: number | undefined;
    course: string;
    qty: number;
}, {
    examType?: string | undefined;
    difficulty?: number | undefined;
    course: string;
    qty: number;
}>;
export declare type FindQuestionType = z.infer<typeof findQuestionSchema>;
export declare type QuestionUploadType = z.infer<typeof questionUploadSchema>;
export declare type QuestionReviewType = z.infer<typeof questionReviewSchema>;
export declare type QuestionEditType = z.infer<typeof questionEditSchema>;
export declare type QuestionSendMessageType = z.infer<typeof questionSendMessageSchema>;
export declare type QuestionFetchMetadataType = z.infer<typeof questionFetchMetadataSchema>;
export declare type QuestionAnswerType = z.infer<typeof questionAnswerSchema>;
export declare type QuestionGenerate = z.infer<typeof questionGenerateSchema>;
