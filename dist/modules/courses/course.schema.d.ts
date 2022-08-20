import { z } from "zod";
export declare const createCourseSchema: z.ZodObject<{
    avatar: z.ZodOptional<z.ZodString>;
    category: z.ZodEnum<["primary", "secondary", "tertiary;"]>;
    course: z.ZodString;
    examTypes: z.ZodArray<z.ZodString, "many">;
    topics: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    avatar?: string | undefined;
    course: string;
    category: "primary" | "secondary" | "tertiary;";
    examTypes: string[];
    topics: string[];
}, {
    avatar?: string | undefined;
    course: string;
    category: "primary" | "secondary" | "tertiary;";
    examTypes: string[];
    topics: string[];
}>;
export declare const editCourseSchema: z.ZodObject<{
    avatar: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<["primary", "secondary", "tertiary;"]>>;
    course: z.ZodOptional<z.ZodString>;
    examTypes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    topics: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    course?: string | undefined;
    category?: "primary" | "secondary" | "tertiary;" | undefined;
    examTypes?: string[] | undefined;
    avatar?: string | undefined;
    topics?: string[] | undefined;
    id: string;
}, {
    course?: string | undefined;
    category?: "primary" | "secondary" | "tertiary;" | undefined;
    examTypes?: string[] | undefined;
    avatar?: string | undefined;
    topics?: string[] | undefined;
    id: string;
}>;
export declare const deleteCourseSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const findOneCourseSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<["primary", "secondary", "tertiary;"]>>;
    course: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    course?: string | undefined;
    category?: "primary" | "secondary" | "tertiary;" | undefined;
    id?: string | undefined;
}, {
    course?: string | undefined;
    category?: "primary" | "secondary" | "tertiary;" | undefined;
    id?: string | undefined;
}>;
export declare type CreateCourseType = z.infer<typeof createCourseSchema>;
export declare type EditCourseType = z.infer<typeof editCourseSchema>;
export declare type DeleteCourseType = z.infer<typeof deleteCourseSchema>;
export declare type FindOneCourseType = z.infer<typeof findOneCourseSchema>;
