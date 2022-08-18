import { Document } from "mongoose";

export type Category = "primary" | "secondary" | "tertiary";

interface BaseCourse {
  avatar?: string;
  category: Category;
  course: string;
  examTypes: string[];
  topics: string[];
}

export interface ICourse extends Document, BaseCourse {}
