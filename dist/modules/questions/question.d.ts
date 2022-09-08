/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { FindQuestionType, QuestionAnswerType, QuestionEditType, QuestionGenerate, QuestionReviewType, QuestionSendMessageType, QuestionUploadType } from "./question.schema";
import { adminModel } from "../admin";
import { Env } from "../../utils/config";
import { Base } from "../../utils/base";
import { questionModel } from "./question.model";
import { courseModel } from "../courses";
import { IQuestion } from "./question.interface";
export declare class Question extends Base {
    QuestionModel: ReturnType<typeof questionModel>;
    AdminModel: ReturnType<typeof adminModel>;
    CourseModel: ReturnType<typeof courseModel>;
    constructor(props: Env);
    /**
     *
     * @param props
     * @returns
     */
    find(props: FindQuestionType): Promise<(IQuestion & {
        _id: import("mongoose").Types.ObjectId;
    }) | (IQuestion & {
        _id: import("mongoose").Types.ObjectId;
    })[] | null | undefined>;
    fetchAllMetadata(props: {
        query: any;
    }): Promise<import("mongoose").LeanDocument<Omit<IQuestion & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>[]>;
    /**
     *
     * @param props
     * @returns
     */
    upload(props: QuestionUploadType): Promise<IQuestion & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    /**
     *
     * @param props
     * @returns
     */
    review(props: QuestionReviewType): Promise<IQuestion & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    /**
     *
     * @param props
     * @returns
     */
    edit(props: QuestionEditType): Promise<IQuestion & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    sendMessage(props: QuestionSendMessageType): Promise<IQuestion & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    answer(props: QuestionAnswerType): Promise<{
        answers: {
            isCorrect: boolean;
            questionId: string;
            answerId: string;
        }[];
        passed: number;
        failed: number;
        invalidAnswers: number;
    }>;
    generate({ difficulty, noOfQuestions, ...props }: QuestionGenerate): Promise<Pick<IQuestion, "course" | "examType" | "category" | "options" | "question" | "topic" | "_id" | "instruction">[]>;
}
