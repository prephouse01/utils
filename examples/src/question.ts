// import { Question } from "@prephouse/utils";
// // create a new question
// export class QuestionExample {
//   question: Question;
//   constructor() {
//     this.question = new Question({
//       DB_URL: process.env.DB_URL as string,
//       UPLOAD_QUESTION_COST: Number(process.env.UPLOAD_QUESTION_COST),
//       REVIEW_QUESTION_COST: Number(process.env.REVIEW_QUESTION_COST),
//     });
//   }

//   async find() {
//     const question = await this.question.find({
//       id: "62b4afe6e54bc2cafddf9cd0",
//     });
//     if (typeof question === typeof Error) {
//       console.log("error");
//       return;
//     }
//     console.log(question);
//   }
// }
