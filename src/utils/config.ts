import envSchema from "env-schema";

interface Env {
  DB_URL: string;
  UPLOAD_QUESTION_COST: number;
  REVIEW_QUESTION_COST: number;
}

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

export const config = envSchema<Env>({
  schema,
  dotenv: true,
});
