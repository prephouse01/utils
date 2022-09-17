import { AnyZodObject, ZodTypeAny } from "zod";

export function validateOption<T, K extends ZodTypeAny = AnyZodObject>(
  schema: K
) {
  return (input: T): T => {
    try {
      const res = schema.parse(input);
      return res as T;
    } catch (error: any) {
      throw new Error (
        error.issues.map(({ message }: { message: string }) => message).join() ??
        "Invalid input"
      );
    }
  };
}
