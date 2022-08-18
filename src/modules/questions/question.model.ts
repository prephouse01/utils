import { model, Schema } from "mongoose";
import { IQuestion as Question } from "./question.interface";

const Message = new Schema(
  {
    message: { type: String, required: true, maxLength: 150 },
    from: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

const questionSchema = new Schema<Question>(
  {
    course: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    instruction: {
      type: String,
      default: undefined,
    },
    examType: {
      type: String,
      trim: true,
      lowercase: true,
      default: "prephouse",
    },
    category: {
      type: String,
      lowercase: true,
      trim: true,
      enum: ["primary", "secondary", "tertiary"],
      required: true,
    },
    answer: {
      type: String,
    },
    question: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    year: {
      type: String,
    },
    options: {
      type: [{ option: String }],
      required: true,
    },
    stats: {
      passed: {
        type: Number,
        default: 0,
      },
      failed: {
        type: Number,
        default: 0,
      },
      difficulty: {
        type: String,
        default: "",
      },
    },
    messages: {
      type: [Message],
      default: [],
    },
    lastReviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    lastEditedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    reviewed: {
      type: Boolean,
      default: false,
    },

    reviewPending: {
      type: Boolean,
      default: false,
    },

    lastReviewedOn: Date,
    lastEditedOn: Date,
  },
  {
    timestamps: true,
  }
);

export const QuestionModel = model<Question>("Question", questionSchema);
// export QuestionModel;
