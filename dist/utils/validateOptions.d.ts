import { AnyZodObject } from "zod";
export declare function validateOption<T>(schema: AnyZodObject): (input: T) => T;
