import { config } from "src/utils/config";
import { validateOption } from "src/utils/validateOptions";
import { QuestionModel } from "./question.model";
import {
  fetchAllQuestionsSchema,
  FetchAllQuestionsType,
  questionEditSchema,
  QuestionEditType,
  questionReviewSchema,
  QuestionReviewType,
  questionSendMessageSchema,
  QuestionSendMessageType,
  questionUploadSchema,
  QuestionUploadType,
} from "./question.schema";
import { pick } from "lodash";
import { AdminModel } from "../admin";

export class Question {
  /**
   *
   * @param props
   * @returns
   */
  static async fetchOneQuestions(props: FetchAllQuestionsType) {
    try {
      const { id } = validateOption<FetchAllQuestionsType>(
        fetchAllQuestionsSchema
      )(props);
      const question = await QuestionModel.findById(id, {
        _id: 0,
        __v: 0,
      });
      if (!question) throw new Error("Didn't find a question");
      return question;
    } catch (error: any) {
      throw new Error("Didn't find a question");
    }
  }

  // type FetchAllMetadata = {
  //   query: any;
  // };
  // async fetchAllMetadata(props: FetchAllMetadata) {
  //   const { query } = props;
  //   try {
  //     const fields = {
  //       course: 1,
  //       category: 1,
  //       examType: 1,
  //       createdAt: 1,
  //       updatedAt: 1,
  //       lastEditedOn: 1,
  //       lastReviewedOn: 1,
  //     };

  //     let questions = QuestionModel.find(query, fields).lean();

  //     return questions;
  //   } catch (error: any) {
  //     throw new Error(error.message ?? "Failed to fetch questions");
  //   }
  // }

  /**
   *
   * @param props
   * @returns
   */
  static async uploadQuestion(props: QuestionUploadType) {
    try {
      const { question, uploadedBy } =
        validateOption<QuestionUploadType>(questionUploadSchema)(props);

      const { answer, ...rest } = question;

      const upload_cost = config.UPLOAD_QUESTION_COST / 2;

      // UPLOAD QUESTION
      const newQuestion = await new QuestionModel({
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
      await AdminModel.findByIdAndUpdate(uploadedBy, {
        $inc: {
          "revenue.total": upload_cost,
        },
      });

      return newQuestion;
    } catch (error: any) {}
  }

  /**
   *
   * @param props
   * @returns
   */
  static async review(props: QuestionReviewType) {
    try {
      const { id, passed, reviewerId, message } =
        validateOption<QuestionReviewType>(questionReviewSchema)(props);
      let question;

      const existingQuestion = await QuestionModel.findById(id);

      if (!existingQuestion) throw new Error("Question not found");

      let update = {};

      const upload_cost = config.UPLOAD_QUESTION_COST / 2;

      const review_cost = config.REVIEW_QUESTION_COST / 2;

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
        question = await QuestionModel.findByIdAndUpdate(
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
          await AdminModel.findByIdAndUpdate(existingQuestion.uploadedBy, {
            $inc: {
              // "revenue.total": upload_cost,
              "revenue.total": -1 * upload_cost,
              "revenue.withdrawable": upload_cost * 2,
            },
          });

          // CREDIT REVIEWER ACCOUNT
          await AdminModel.findByIdAndUpdate(reviewerId, {
            $inc: {
              "revenue.withdrawable": review_cost * 2,
            },
          });
        }

        // THIS ISN'T THE FIRST TIME THE QUESTION HAS BEEN REVIEWED
        else {
          // UNCREDIT LAST REVIEWER ACCOUNT
          await AdminModel.findByIdAndUpdate(existingQuestion.lastReviewedBy, {
            $inc: {
              "revenue.total": -1 * review_cost,
            },
          });

          // CREDIT UPLOADER ACCOUNT
          await AdminModel.findByIdAndUpdate(existingQuestion.uploadedBy, {
            $inc: {
              "revenue.toal": -1 * upload_cost,
              "revenue.withdrawable": upload_cost,
            },
          });

          // CREDIT LAST EDITOR ACCOUNT
          await AdminModel.findByIdAndUpdate(existingQuestion.lastEditedBy, {
            $inc: {
              "revenue.total": -1 * upload_cost,
              "revenue.withdrawable": upload_cost,
            },
          });

          // CREDIT REVIEWER ACCOUNT
          await AdminModel.findByIdAndUpdate(reviewerId, {
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
      else {
        question = await QuestionModel.findByIdAndUpdate(
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
          await AdminModel.findByIdAndUpdate(existingQuestion.lastReviewedBy, {
            $inc: {
              "revenue.total": -1 * review_cost,
            },
          });
        }

        // SET LAST REVIEWED BY
        question.lastReviewedBy = reviewerId;
        await question.save();

        // CREDIT REVIEWER ACCOUNT
        await AdminModel.findByIdAndUpdate(reviewerId, {
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
  static async edit(props: QuestionEditType) {
    try {
      const { id, editedBy } =
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
      const existingQuestion = await QuestionModel.findById(id);

      if (!existingQuestion) throw new Error("Question not found");

      // QUESTION HAS BEEN EDITED BEFORE
      if (existingQuestion.lastEditedBy) {
        // UNCREDIT LAST EDITOR ACCOUNT
        await AdminModel.findByIdAndUpdate(existingQuestion.lastEditedBy, {
          $inc: {
            "revenue.total": -1 * upload_cost,
          },
        });
      }

      // if(existingQuestion.uploadedBy !== editedBy) throw new HttpException("You can't edit this question")

      const newQuestion = await QuestionModel.findByIdAndUpdate(
        id,
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
      await AdminModel.findByIdAndUpdate(editedBy, {
        $inc: {
          "revenue.total": upload_cost,
        },
      });
      return newQuestion;
    } catch (error: any) {
      throw new Error(error.message ?? "Failed to create new questions");
    }
  }

  static async message(props: QuestionSendMessageType) {
    try {
      const { questionId, message, reviewerId } =
        validateOption<QuestionSendMessageType>(questionSendMessageSchema)(
          props
        );
      await QuestionModel.findByIdAndUpdate(questionId, {
        $push: { messages: message, from: reviewerId },
      });
    } catch (error: any) {
      throw new Error(error.message ?? "Failed to send message");
    }
  }
}
