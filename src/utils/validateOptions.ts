import { AnyZodObject, ZodTypeAny } from "zod";

export function validateOption<T, K extends ZodTypeAny = AnyZodObject>(
  schema: K
) {
  return (input: T): T => {
    const res = schema.parse(input);
    return res as T;
  };
}
