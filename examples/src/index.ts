import "dotenv/config";
import { Course, Question } from "../../src";

const question = new Question({
  DB_URL: process.env.DB_URL as string,
  UPLOAD_QUESTION_COST: Number(process.env.UPLOAD_QUESTION_COST),
  REVIEW_QUESTION_COST: Number(process.env.REVIEW_QUESTION_COST),
});

const course = new Course({
  DB_URL: process.env.DB_URL as string,
  UPLOAD_QUESTION_COST: Number(process.env.UPLOAD_QUESTION_COST),
  REVIEW_QUESTION_COST: Number(process.env.REVIEW_QUESTION_COST),
});

async function ops() {
  // find course
  // await course
  //   .findOne({
  //     id: "62b09b5d8eab8da481309869",
  //   })
  //   .then((c) => {
  //     console.info("find a course:\t", c, "\n\n");
  //     return;
  //   })
  //   .catch((e: any) => {
  //     console.error(e.message, "\n\n");
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

  // answer question
  // await question
  //   .answer({
  //     answers: [
  //       {
  //         answerId: "630780177a714150f84ccbe1",
  //         questionId: "6307791e8ae767b1fc3fb6ec",
  //       },
  //     ],
  //     // select: "topics",
  //   })
  //   .then((q) => console.log(q))
  //   .catch((e: any) => console.log(e.message));

  // find question
  // await question
  //   .find({
  //     id: "6307791e8ae767b1fc3fb6ec",
  //     // projection: {
  //     //   stats: 1,
  //     //   options: 0,
  //     // },
  //     // select: "topics",
  //   })
  //   .then((q) => console.log(q))
  //   .catch((e: any) => console.log(e.message));

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
  //   .then((q) => console.log("q"))
  //   .catch((e) => console.log(e.message));
  // 6300e9fa70da4497fe3aad6c
  // course: "62b09b5d8eab8da481309869",
  //

  // GENERATE QUESTIONS

  // await question
  //   .generate({
  //     course: "62b09b5d8eab8da481309869",
  //     qty: 10,
  //   })
  //   .then((q) => console.log(q))
  //   .catch((e) => console.log(e.message));

  // find course
  // await course
  //   .findMultiple({
  //     // ids: ["62b09b5d8eab8da481309869", "62ff60935583d465bb9cb7c6"],
  //     // category: "secondary",
  //     // course: ["mathematics", "geography"]
  //   })
  //   .then((q) => console.log(q))
  //   .catch((e: any) => console.log(e.message));
}

ops();
