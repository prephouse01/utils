import envSchema from "env-schema";

export type Env = {
  DB_URL: string;
  UPLOAD_QUESTION_COST: number;
  REVIEW_QUESTION_COST: number;
};

export function config(data: Env) {
  const schema = {
    title: "config",
    description: "test environment variables",
    properties: {
      DB_URL: {
        type: "string",
      },
      UPLOAD_QUESTION_COST: {
        type: "number",
      },
      REVIEW_QUESTION_COST: {
        type: "number",
      },
    },
  };

  const config = envSchema<Env>({
    schema,
    data: data,
  });

  return config;
}
