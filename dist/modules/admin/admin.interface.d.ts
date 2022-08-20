import { Schema, Document } from "mongoose";
import { Category } from "../courses";
interface Permission {
    action: "review" | "upload";
    course: string;
    category: Category;
    examTypes: string[];
}
interface BaseAdmin {
    name: {
        first: string;
        last: string;
    };
    email: string;
    contact: string;
    role: string;
    adminLevel: number;
    disabled: boolean;
    revenue: {
        total: number;
        withdrawable: number;
    };
    notifications: Schema.Types.ObjectId[];
    creatorPermissions: Permission[];
    token?: string;
    avatar?: string;
    bank?: string;
    accountNumber?: string;
    accountName?: string;
}
export interface Admin extends Document, BaseAdmin {
}
export {};
