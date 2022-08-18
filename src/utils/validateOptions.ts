import { AnyZodObject } from "zod";

export function validateOption<T>(schema: AnyZodObject) {
  return (input: T): T => {
    const res = schema.parse(input);
    return res as T;
  };
}
