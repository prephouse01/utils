import { model, Schema } from "mongoose";
import { ICourse as Course } from "./course.interface";

const courseSchema = new Schema<Course>({
  avatar: String,
  category: {
    type: String,
    enum: ["primary", "secondary", "tertiary"],
    required: true,
    lowercase: true,
    trim: true,
  },
  course: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  examTypes: {
    type: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
  },
  topics: {
    type: [{ type: String, lowercase: true, trim: true }],
  },
});

export const CourseModel = model("Course", courseSchema);
