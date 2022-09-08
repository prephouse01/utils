import { Document, Schema } from "mongoose";
import { ICourse } from "../courses";

interface option extends Document {
  option: string;
}

interface QuestionStats {
  passed: number;
  failed: number;
  difficulty: number;
}

interface Message extends Document {
  message: string;
  from: string;
}

interface BaseQuestion {
  course: ICourse;
  instruction?: string;
  examType?: string;
  category: string;
  answer: string;
  question: string;
  options: option[];
  stats?: QuestionStats;
  messages: Message[];
  topic: string;
  year?: string;
  reviewedBy: Schema.Types.ObjectId | string;
  uploadedBy: Schema.Types.ObjectId | string;
  reviewed: boolean;
  reviewPending: boolean;
  lastReviewedBy: Schema.Types.ObjectId | string;
  lastEditedBy: Schema.Types.ObjectId | string;
  lastReviewedOn?: Date;
  lastEditedOn?: Date;
}

export interface IQuestion extends Document, BaseQuestion {}
