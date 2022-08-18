import "dotenv/config";
import { Question } from "../../src";

const question = new Question({
  DB_URL: process.env.DB_URL as string,
  UPLOAD_QUESTION_COST: Number(process.env.UPLOAD_QUESTION_COST),
  REVIEW_QUESTION_COST: Number(process.env.REVIEW_QUESTION_COST),
});

async function find(id: string) {
  const q = await question.find({
    id,
  });
  if (typeof q === typeof Error) {
    console.log("error");
    return;
  }
  console.log(q);
}

find("62b4afe6e54bc2cafddf9cd0");

console.log("something else");

find("62b4b085e54bc2cafddf9cdd");

question.closeConnection();
