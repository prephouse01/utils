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
import { courseModel } from "./course.model";
import { CreateCourseType, DeleteCourseType, EditCourseType, FindOneCourseType } from "./course.schema";
import { Env } from "../../utils/config";
import { connectDB } from "../../utils/connectDB";
import { ICourse } from "./course.interface";
export declare class Course {
    config: Env;
    connection: ReturnType<typeof connectDB>;
    CourseModel: ReturnType<typeof courseModel>;
    constructor(props: Env);
    create(props: CreateCourseType): Promise<import("mongoose").FlattenMaps<import("mongoose").LeanDocument<any>>>;
    edit(props: EditCourseType): Promise<import("mongoose").FlattenMaps<import("mongoose").LeanDocument<any>>>;
    delete(props: DeleteCourseType): Promise<import("mongoose").FlattenMaps<import("mongoose").LeanDocument<any>>>;
    /**
     * @description find a course by id or course and category
     * @param props
     * @returns {ICourse} course
     */
    findOne(props: FindOneCourseType): Promise<Error | (ICourse & {
        _id: import("mongoose").Types.ObjectId;
    })>;
    findMultiple(): Promise<Error>;
}
