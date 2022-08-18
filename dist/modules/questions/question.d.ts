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
import { questionModel } from "./question.model";
import { FindQuestionType, QuestionAnswerType, QuestionEditType, QuestionReviewType, QuestionSendMessageType, QuestionUploadType } from "./question.schema";
import { Env } from "../../utils/config";
import { connectDB } from "../../utils/connectDB";
export declare class Question {
    config: Env;
    connection: ReturnType<typeof connectDB>;
    QuestionModel: ReturnType<typeof questionModel>;
    constructor(props: Env);
    /**
     *
     * @param props
     * @returns
     */
    find(props: FindQuestionType): Promise<Error | (import("./question.interface").IQuestion & {
        _id: import("mongoose").Types.ObjectId;
    }) | (import("./question.interface").IQuestion & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    /**
     *
     * @param props
     * @returns
     */
    upload(props: QuestionUploadType): Promise<import("mongoose").FlattenMaps<import("mongoose").LeanDocument<any>>>;
    /**
     *
     * @param props
     * @returns
     */
    review(props: QuestionReviewType): Promise<import("mongoose").FlattenMaps<import("mongoose").LeanDocument<any>>>;
    /**
     *
     * @param props
     * @returns
     */
    edit(props: QuestionEditType): Promise<import("mongoose").FlattenMaps<import("mongoose").LeanDocument<any>>>;
    sendMessage(props: QuestionSendMessageType): Promise<import("mongoose").FlattenMaps<import("mongoose").LeanDocument<any>>>;
    answer(props: QuestionAnswerType): Promise<Error | {
        isCorrect: boolean;
        questionId: string;
        answerId: number;
    }[]>;
}
