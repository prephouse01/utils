import {
  findQuestionSchema,
  FindQuestionType,
  questionAnswerSchema,
  QuestionAnswerType,
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
import { adminModel } from "../admin";
import { validateOption } from "../../utils/validateOptions";
import { Env } from "../../utils/config";
import { Base } from "../../utils/base";
import { questionModel } from "./question.model";

export class Question extends Base {
  QuestionModel: ReturnType<typeof questionModel>;
  AdminModel: ReturnType<typeof adminModel>;
  constructor(props: Env) {
    super(props);
    this.QuestionModel = questionModel(this.connection);
    this.AdminModel = adminModel(this.connection);
  }

  /**
   *
   * @param props
   * @returns
   */
  async find(props: FindQuestionType) {
    try {
      const { id } =
        validateOption<FindQuestionType>(findQuestionSchema)(props);
      let res;
      if (typeof id === "string") {
        res = await this.QuestionModel.findById(id, {
          _id: 0,
          __v: 0,
        });
      } else if (Array.isArray(id)) {
        res = await this.QuestionModel.find(
          { _id: { $in: id } },
          {
            _id: 0,
            __v: 0,
          }
        );
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

      let questions = this.QuestionModel.find(query, fields).lean();

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
      if (Array.isArray(answers)) {
        for (let i = 0; i < answers.length; i++) {
          const { questionId, answerId } = answers[i];
          const question = await this.QuestionModel.findById(questionId);
          if (!question) throw new Error("Question not found");
          const isCorrect = question.answer.toString() === answerId.toString();

          res.push({ ...answers[i], isCorrect });

          if (isCorrect) {
            await this.QuestionModel.findByIdAndUpdate(questionId, {
              $inc: {
                "stats.passed": 1,
              },
            });
          } else {
            await this.QuestionModel.findByIdAndUpdate(questionId, {
              $inc: {
                "stats.failed": 1,
              },
            });
          }
        }
      }

      return res;
    } catch (error: any) {
      throw new Error(error.message ?? "Failed to answer question");
    }
  }
}
