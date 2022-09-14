import { AnyZodObject, ZodTypeAny } from "zod";
export declare function validateOption<T, K extends ZodTypeAny = AnyZodObject>(schema: K): (input: T) => T;
