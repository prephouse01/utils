import {
  findQuestionSchema,
  FindQuestionType,
  questionAnswerSchema,
  QuestionAnswerType,
  questionEditSchema,
  QuestionEditType,
  QuestionGenerate,
  questionReviewSchema,
  QuestionReviewType,
  questionSendMessageSchema,
  QuestionSendMessageType,
  questionUploadSchema,
  QuestionUploadType,
} from "./question.schema";
import { pick } from "lodash";
import { adminModel } from "../admin";
import { validateOption } from "../../utils/validateOptions";
import { Env } from "../../utils/config";
import { Base } from "../../utils/base";
import { questionModel } from "./question.model";
import { courseModel, ICourse } from "../courses";
import { IQuestion } from "./question.interface";

export class Question extends Base {
  QuestionModel: ReturnType<typeof questionModel>;
  AdminModel: ReturnType<typeof adminModel>;
  CourseModel: ReturnType<typeof courseModel>;
  constructor(props: Env) {
    super(props);
    this.QuestionModel = questionModel(this.connection);
    this.AdminModel = adminModel(this.connection);
    this.CourseModel = courseModel(this.connection);

    // this.updateQuestions();
  }

  // async updateQuestions() {
  //   await this.QuestionModel.updateMany(
  //     {},
  //     {
  //       // $set: { "stats.difficulty": 0 },
  //       $unset: { difficulty: "" },
  //     }
  //   );
  //   // for (let i = 0; i < questions.length; i++) {
  //   //   const q = questions[i];
  //   //   try {
  //   //     const c = await this.CourseModel.findOne({
  //   //       course: q.course,
  //   //       category: q.category,
  //   //     });
  //   //     if (!c) {
  //   //       console.error(`no course found for ${q._id}`);
  //   //       await q.remove();
  //   //       continue;
  //   //     }
  //   //     q.course = c._id;
  //   //     await q.save();
  //   //   } catch (e: any) {
  //   //     console.error(`error occured found for ${q._id}`);
  //   //   }
  //   // }
  // }

  /**
   *
   * @param props
   * @returns
   */
  async find(props: FindQuestionType) {
    try {
      const { id, select = "" } =
        validateOption<FindQuestionType>(findQuestionSchema)(props);
      let res;
      if (typeof id === "string") {
        res = await this.QuestionModel.findById(id, {
          ...props.projection,
        });
        await this.QuestionModel.populate(res, { path: "course", select });
      } else if (Array.isArray(id)) {
        res = await this.QuestionModel.find(
          { _id: { $in: id } },
          { ...props.projection }
        );
        await this.QuestionModel.populate(res, { path: "course", select });
      }
      return res;
    } catch (error: any) {
      throw new Error(error.message ?? "Didn't find a question");
    }
  }

  async fetchAllMetadata(props: { query: any }) {
    const { query } = props;
    try {
      const fields = {
        course: 1,
        category: 1,
        examType: 1,
        createdAt: 1,
        updatedAt: 1,
        lastEditedOn: 1,
        lastReviewedOn: 1,
      };

      let questions = this.QuestionModel.find(query, fields)
        .populate("course")
        .lean();

      return questions;
    } catch (error: any) {
      throw new Error(error.message ?? "Failed to fetch questions");
    }
  }

  /**
   *
   * @param props
   * @returns
   */
  async upload(props: QuestionUploadType) {
    try {
      const { question, uploadedBy } =
        validateOption<QuestionUploadType>(questionUploadSchema)(props);

      const course = await this.CourseModel.findById(question.course);
      if (!course) throw new Error("This course dosen't exist");

      const { answer, ...rest } = question;

      const upload_cost = this.config.UPLOAD_QUESTION_COST / 2;

      // UPLOAD QUESTION
      const newQuestion = await new this.QuestionModel({
        ...rest,
        options: rest.options.map((option) => ({ option })),
        reviewPending: true,
        uploadedBy,
        // lastEditedBy: uploadedBy,
      }).save();

      // SET THE ANSWER
      newQuestion.answer = newQuestion.options[answer]._id;
      await newQuestion.save();

      // CREDIT UPLOADER ACCOUNT
      await this.AdminModel.findByIdAndUpdate(uploadedBy, {
        $inc: {
          "revenue.total": upload_cost,
        },
      });

      return newQuestion;
    } catch (error: any) {
      throw new Error(error.message ?? "Failed to upload question");
    }
  }

  /**
   *
   * @param props
   * @returns
   */
  async review(props: QuestionReviewType) {
    try {
      const { id, passed, reviewerId, message } =
        validateOption<QuestionReviewType>(questionReviewSchema)(props);
      let question;

      const existingQuestion = await this.QuestionModel.findById(id);

      if (!existingQuestion) throw new Error("Question not found");

      if (!existingQuestion.reviewPending)
        throw new Error("Question is not pending review");

      let update = {};

      const upload_cost = this.config.UPLOAD_QUESTION_COST / 2;

      const review_cost = this.config.REVIEW_QUESTION_COST / 2;

      // question hasn't been reviewed before
      if (!existingQuestion.lastReviewedBy) {
        update = {
          reviewedBy: reviewerId,
          // lastReviewedBy: reviewerId,
        };
      }

      // question has been reviewed before
      else {
        update = {
          lastReviewedBy: reviewerId,
        };
      }

      // QUESTION PASSED REVIEW
      if (passed) {
        question = await this.QuestionModel.findByIdAndUpdate(
          id,
          {
            reviewPending: false,
            reviewed: true,
            lastEditedBy:
              existingQuestion.lastEditedBy ?? existingQuestion.uploadedBy,
            lastEditedOn: new Date(),
            lastReviewedOn: new Date(),
            ...update,
          },
          { new: true }
        );

        if (!question) throw new Error("Failed to review question");

        // IF THE QUESTION PASSES REVIEW ON FIRST GO
        if (!existingQuestion.lastEditedBy) {
          // CREDIT UPLOADER ACCOUNT
          await this.AdminModel.findByIdAndUpdate(existingQuestion.uploadedBy, {
            $inc: {
              // "revenue.total": upload_cost,
              "revenue.total": -1 * upload_cost,
              "revenue.withdrawable": upload_cost * 2,
            },
          });

          // CREDIT REVIEWER ACCOUNT
          await this.AdminModel.findByIdAndUpdate(reviewerId, {
            $inc: {
              "revenue.withdrawable": review_cost * 2,
            },
          });
        }

        // THIS ISN'T THE FIRST TIME THE QUESTION HAS BEEN REVIEWED
        else {
          // UNCREDIT LAST REVIEWER ACCOUNT
          await this.AdminModel.findByIdAndUpdate(
            existingQuestion.lastReviewedBy,
            {
              $inc: {
                "revenue.total": -1 * review_cost,
              },
            }
          );

          // CREDIT UPLOADER ACCOUNT
          await this.AdminModel.findByIdAndUpdate(existingQuestion.uploadedBy, {
            $inc: {
              "revenue.toal": -1 * upload_cost,
              "revenue.withdrawable": upload_cost,
            },
          });

          // CREDIT LAST EDITOR ACCOUNT
          await this.AdminModel.findByIdAndUpdate(
            existingQuestion.lastEditedBy,
            {
              $inc: {
                "revenue.total": -1 * upload_cost,
                "revenue.withdrawable": upload_cost,
              },
            }
          );

          // CREDIT REVIEWER ACCOUNT
          await this.AdminModel.findByIdAndUpdate(reviewerId, {
            $inc: {
              "revenue.withdrawable": review_cost,
            },
          });
        }

        // UPDATE LAST REVIEWED BY
        question.lastReviewedBy = reviewerId;
        await question.save();
      }

      // QUESTION FAILED REVIEW
      // MESSAGE IS SENT HERE
      else {
        question = await this.QuestionModel.findByIdAndUpdate(
          id,
          {
            $set: {
              reviewPending: false,
              reviewed: false,
              lastReviewedOn: new Date(),
              ...update,
            },
            $push: { messages: { message, from: reviewerId } },
          },
          { new: true }
        );

        if (!question) throw new Error("Failed to review question");
        // QUESTION HAS BEEN REVIEWED BEFORE
        if (existingQuestion.lastEditedBy) {
          // UNCREDIT LAST REVIEWER ACCOUNT
          await this.AdminModel.findByIdAndUpdate(
            existingQuestion.lastReviewedBy,
            {
              $inc: {
                "revenue.total": -1 * review_cost,
              },
            }
          );
        }

        // SET LAST REVIEWED BY
        question.lastReviewedBy = reviewerId;
        await question.save();

        // CREDIT REVIEWER ACCOUNT
        await this.AdminModel.findByIdAndUpdate(reviewerId, {
          $inc: {
            "revenue.total": review_cost,
          },
        });
      }

      return question;
    } catch (error: any) {
      throw new Error(error.message ?? "Failed to review questions");
    }
  }

  /**
   *
   * @param props
   * @returns
   */
  async edit(props: QuestionEditType) {
    try {
      const { questionId, editedBy } =
        validateOption<QuestionEditType>(questionEditSchema)(props);
      const question = pick(props.question, [
        "course",
        "instructions",
        "answer",
        "question",
        "topic",
        "year",
        "options",
      ]);
      const { answer, options, ...rest } = question;
      const upload_cost =
        parseFloat(process.env.UPLOAD_QUESTION_COST as string) / 2;
      const existingQuestion = await this.QuestionModel.findById(questionId);

      if (!existingQuestion) throw new Error("Question not found");

      // QUESTION HAS BEEN EDITED BEFORE
      if (existingQuestion.lastEditedBy) {
        // UNCREDIT LAST EDITOR ACCOUNT
        await this.AdminModel.findByIdAndUpdate(existingQuestion.lastEditedBy, {
          $inc: {
            "revenue.total": -1 * upload_cost,
          },
        });
      }

      // if(existingQuestion.uploadedBy !== editedBy) throw new HttpException("You can't edit this question")

      const newQuestion = await this.QuestionModel.findByIdAndUpdate(
        questionId,
        {
          ...rest,
          options: options.map((option) => ({ option })),
          reviewPending: true,
          reviewed: false,
          lastEditedBy: editedBy,
        },
        { new: true }
      );

      if (!newQuestion) throw new Error("Failed to edit question");

      // SET THE ANSWER
      newQuestion.answer = newQuestion.options[answer]._id;
      newQuestion.lastEditedOn = new Date();
      await newQuestion.save();

      // CREDIT EDITOR ACCOUNT
      await this.AdminModel.findByIdAndUpdate(editedBy, {
        $inc: {
          "revenue.total": upload_cost,
        },
      });

      return newQuestion;
    } catch (error: any) {
      throw new Error(error.message ?? "Failed to create new questions");
    }
  }

  async sendMessage(props: QuestionSendMessageType) {
    try {
      const { questionId, message, reviewerId } =
        validateOption<QuestionSendMessageType>(questionSendMessageSchema)(
          props
        );
      const msg = await this.QuestionModel.findByIdAndUpdate(
        questionId,
        {
          $push: { messages: message, from: reviewerId },
        },
        { new: true }
      );
      if (!msg) throw new Error("Failed to send message");

      return msg;
    } catch (error: any) {
      throw new Error(error.message ?? "Failed to send message");
    }
  }

  async answer(props: QuestionAnswerType) {
    try {
      const { answers } =
        validateOption<QuestionAnswerType>(questionAnswerSchema)(props);
      let res = [];
      let passed = 0;
      let failed = 0;
      let invalidAnswers = 0;

      if (!Array.isArray(answers)) throw new Error("Invalid input");

      for (let i = 0; i < answers.length; i++) {
        const { questionId, answerId } = answers[i];
        const question = await this.QuestionModel.findById(questionId);
        if (!question) throw new Error("Question not found");

        // check if answerid is part of the options
        const opts = question.options.filter(
          (opt) => opt._id.toString() === answerId.toString()
        );

        if (opts.length === 0) {
          invalidAnswers++;
          continue;
        }

        const isCorrect = question.answer.toString() === answerId.toString();

        res.push({ ...answers[i], isCorrect });

        /**
         * difficulty starts counting once a question has been answered more than 100 times.
         *
         * we calculate the difficulty with the difficulty index.
         * i.e difficulty = passed / total
         *
         * 0.00 - 0.20 = very difficult
         * 0.21 - 0.80 = moderately difficult
         * 0.81 - 1.00 = very easy
         */

        const total =
          (question.stats?.passed ?? 0) + (question.stats?.failed ?? 0) + 1;
        if (isCorrect) {
          const diff = (((question.stats?.passed ?? 0) + 1) / total).toFixed(2);
          await this.QuestionModel.findByIdAndUpdate(questionId, {
            $inc: {
              "stats.passed": 1,
            },
            "stats.difficulty": total > 100 ? diff : 1,
          });
          passed++;
        } else {
          const diff = ((question.stats?.passed ?? 0) / total).toFixed(2);
          await this.QuestionModel.findByIdAndUpdate(questionId, {
            $inc: {
              "stats.failed": 1,
            },
            "stats.difficulty": total > 100 ? diff : 1,
          });
          failed++;
        }
      }

      return { answers: res, passed, failed, invalidAnswers };
    } catch (error: any) {
      throw new Error(error.message ?? "Failed to answer question");
    }
  }

  async generate({
    difficulty = 70,
    noOfQuestions,
    ...props
  }: QuestionGenerate) {
    try {
      const params = { ...props, difficulty };
      let course = await this.CourseModel.findById(params.course);

      if (!course) throw new Error("No course found");

      type K = keyof typeof params;
      const keys = Object.keys(params) as K[];

      // if an examtype is provided, check if the course supports it
      // if it dosen't, pick an examtype from the course at random

      if (
        keys.includes("examType") &&
        params["examType"] &&
        !course.examTypes.includes(params["examType"])
      )
        params["examType"] =
          course.examTypes[Math.floor(Math.random() * course.examTypes.length)];

      //@ts-ignore
      let match: Record<K, any> = {
        // course: props.course,
        // noOfQuestions: props.noOfQuestions,
        // difficulty: props.difficulty,
        // examType: props.examType,
      };

      for (let i = 0; i < keys.length; i++) {
        if (keys[i] === "course") {
          match.course = { $eq: course._id };
          continue;
        }
        if (keys[i] === "difficulty") {
          match.difficulty = { $eq: params[keys[i]] };
          continue;
        }
        match[keys[i]] = { $eq: params[keys[i]] };
      }

      // monitor while loop
      let lap = 1;

      /**
       *
       *
       * STEP 1: fetch with the query the user provided
       * STEP 2: fetch with a lower difficulty
       * STEP 3: fetch with the other examTypes with a difficulty less than or equal to
       *         the current difficulty
       * STEP 4: fetch with other courses in the same category with a difficulty lower
       *         or equal to the current difficulty
       *
       *
       */

      const project = {
        instruction: 1,
        _id: 1,
        course: 1,
        examType: 1,
        category: 1,
        question: 1,
        topic: 1,
        options: 1,
      };

      type Question = Pick<IQuestion, keyof typeof project>;

      let questions: Question[] = [];

      let parsedCourses = [course._id];

      // run the while loop a maximum of 5 times
      while (questions.length < noOfQuestions || lap > 5) {
        if (!course) break;
        let activeCourse = course;

        if (lap > 1) {
          const courses: ICourse[] = await this.CourseModel.aggregate([
            {
              $match: {
                _id: { $nin: parsedCourses },
                category: course.category,
              },
            },
            { $sample: { size: 1 } },
          ]).exec();
          if (courses.length === 0) break;
          // @ts-ignore
          activeCourse = courses[0];
          parsedCourses.push(activeCourse._id);
          match.course = activeCourse._id;
        }

        // $expr{
        //   $ne: ["$_id", { $toObjectId: course._id }],
        // }

        let matchs: any[] = [];

        for (let i = 0; i < keys.length; i++) {
          if (i === 0) {
            const { course: c, difficulty, ...others } = match;
            matchs.push({
              ...others,
              "stats.difficulty": { $eq: params.difficulty },
              $expr: {
                $eq: ["$course", { $toObjectId: activeCourse._id }],
              },
            });
            continue;
          }

          if (i === 1) {
            const { course: c, difficulty, ...others } = match;
            matchs.push({
              ...others,
              "stats.difficulty": { $lt: params.difficulty },
              $expr: {
                $eq: ["$course", { $toObjectId: activeCourse._id }],
              },
            });
            continue;
          }

          if (i === 2 && keys.includes("examType")) {
            const { course: c, difficulty, ...others } = match;
            const cat = activeCourse.examTypes.filter(
              // @ts-ignore
              (c) => c !== params["examType"]
            );
            matchs.push({
              examType: { $in: cat },
              "stats.difficulty": { $lte: params.difficulty },
              $expr: {
                $eq: ["$course", { $toObjectId: activeCourse._id }],
              },
            });
            continue;
          }
        }

        const quests: Question[][] = await Promise.all(
          matchs.map((x) =>
            this.QuestionModel.aggregate([
              {
                $match: x,
              },
              { $project: project },
              { $sample: { size: noOfQuestions - questions.length } },
            ]).exec()
          )
        );

        quests.forEach((q) => {
          questions = questions.concat(q);
        });

        questions = questions.slice(0, noOfQuestions);
        await this.QuestionModel.populate(questions, {
          path: "course",
          select: "avatar course category",
        });

        lap++;
      }
      return questions;
    } catch (error: any) {
      throw new Error(error.message ?? "Failed to generate question");
    }
  }
}
