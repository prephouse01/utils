import { Schema } from "mongoose";
import { connectDB } from "../../utils/connectDB";
import { ICourse as Course } from "./course.interface";

export function courseModel(M: ReturnType<typeof connectDB>) {
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

  return M.model("Course", courseSchema);
}
