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
import { CreateCourseType, DeleteCourseType, EditCourseType, FindMultipleCourseType, FindOneCourseType } from "./course.schema";
import { Env } from "../../utils/config";
import { ICourse } from "./course.interface";
import { Base } from "../../utils/base";
export declare class Course extends Base {
    CourseModel: ReturnType<typeof courseModel>;
    constructor(props: Env);
    create(props: CreateCourseType): Promise<import("mongoose").Document<unknown, any, ICourse> & ICourse & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    edit(props: EditCourseType): Promise<import("mongoose").Document<unknown, any, ICourse> & ICourse & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    delete(props: DeleteCourseType): Promise<import("mongoose").Document<unknown, any, ICourse> & ICourse & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    findOne(props: FindOneCourseType): Promise<(import("mongoose").Document<unknown, any, ICourse> & ICourse & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>) | null>;
    /**
     * @description
     * Find multiple courses using the following conditions in order of prefrence
     * 1. Without a parameter
     * 2. By Id's
     * 3. By category
     * 4. By course title
     *
     * @returns an array of courses or an empty array
     * */
    findMultiple(props: FindMultipleCourseType): Promise<ICourse[]>;
}
