import { validateOption } from "src/utils/validateOptions";
import { CourseModel } from "./course.model";
import {
  createCourseSchema,
  CreateCourseType,
  deleteCourseSchema,
  DeleteCourseType,
  editCourseSchema,
  EditCourseType,
} from "./course.schema";
import { omit } from "lodash";

export class Course {
  static async create(props: CreateCourseType) {
    try {
      const data = validateOption<CreateCourseType>(createCourseSchema)(props);
      const course = await CourseModel.findOne({ course: data.course });
      if (course) throw new Error(`Course ${data.course} already exists`);
      return await CourseModel.create(props);
    } catch (error: any) {
      throw new Error(error.message ?? "Failed to create a new course");
    }
  }

  static async edit(props: EditCourseType) {
    try {
      const data = validateOption<EditCourseType>(editCourseSchema)(props);
      await CourseModel.findOneAndUpdate({ id: props.id }, omit(data, ["id"]));
    } catch (error: any) {
      throw new Error("Failed to edit this course course");
    }
  }

  static async deleteCourse(props: DeleteCourseType) {
    try {
      const { id } =
        validateOption<DeleteCourseType>(deleteCourseSchema)(props);
      await CourseModel.findOneAndDelete({ _id: id });
    } catch (error: any) {
      throw new Error("Failed to delete this course");
    }
  }
}
