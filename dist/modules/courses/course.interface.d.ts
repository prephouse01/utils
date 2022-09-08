import { Schema } from "mongoose";
export declare type Category = "primary" | "secondary" | "tertiary";
interface BaseCourse {
    avatar?: string;
    category: Category;
    course: string;
    examTypes: string[];
    topics: string[];
}
declare type Document = {
    _id: Schema.Types.ObjectId;
    createdAt: string;
    updatedAt: string;
};
export interface ICourse extends Document, BaseCourse {
}
export {};
