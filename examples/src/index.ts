import "dotenv/config";
import { Course, Question } from "../../src";

const question = new Question({
  DB_URL: process.env.DB_URL as string,
  UPLOAD_QUESTION_COST: Number(process.env.UPLOAD_QUESTION_COST),
  REVIEW_QUESTION_COST: Number(process.env.REVIEW_QUESTION_COST),
});

// const course = new Course({
//   DB_URL: process.env.DB_URL as string,
//   UPLOAD_QUESTION_COST: Number(process.env.UPLOAD_QUESTION_COST),
//   REVIEW_QUESTION_COST: Number(process.env.REVIEW_QUESTION_COST),
// });

async function ops() {
  // find course
  // await course
  //   .findOne({
  //     id: "62b09b5d8eab8da481309869",
  //   })
  //   .then((c) => {
  //     console.log(c);
  //     return;
  //   })
  //   .catch((e: any) => {
  //     console.log(e.message);
  //   });

  // create course
  // await course
  //   .create({
  //     category: "secondary",
  //     course: "mathematics",
  //     examTypes: ["neco", "federal", "state"],
  //     topics: ["set", "probability", "statistics"],
  //   })
  //   .then((c) => {
  //     console.log(c);
  //     return;
  //   })
  //   .catch((e: any) => {
  //     console.log(e.message);
  //   });

  // find question
  await question
    .find({
      id: "63060abbd545e75c65392c2d",
    })
    .then((q) => console.log(q))
    .catch((e: any) => console.log(e.message));

  // await question
  //   .upload({
  //     question: {
  //       course: "62b09b5d8eab8da481309869",
  //       category: "primary",
  //       examType: "federal",
  //       answer: 1,
  //       question: "What is the first letter of the alphabet",
  //       options: ["A", "B"],
  //       topic: "alphabets",
  //     },
  //     uploadedBy: "62b0b4fa8e4e76578ca97393",
  //   })
  //   .then((q) => console.log(q))
  //   .catch((e) => console.log(e.message));
}

ops();
