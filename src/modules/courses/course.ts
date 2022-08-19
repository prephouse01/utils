import { courseModel } from "./course.model";
import {
  createCourseSchema,
  CreateCourseType,
  deleteCourseSchema,
  DeleteCourseType,
  editCourseSchema,
  EditCourseType,
  findOneCourseSchema,
  FindOneCourseType,
} from "./course.schema";
import { omit } from "lodash";
import { validateOption } from "../../utils/validateOptions";
import { config, Env } from "../../utils/config";
import { connectDB, disconnectDB } from "../../utils/connectDB";
import { ICourse } from "./course.interface";
import { Base } from "../../utils/base";

export class Course extends Base {
  CourseModel: ReturnType<typeof courseModel>;

  constructor(props: Env) {
    super(props);
    this.CourseModel = courseModel(this.connection);
  }

  async create(props: CreateCourseType) {
    try {
      // verify input schema
      const data = validateOption<CreateCourseType>(createCourseSchema)(props);
      // create new course
      const course = await this.CourseModel.findOne({
        course: data.course,
        category: data.category,
      });
      if (course)
        throw new Error(
          `${data.course.toUpperCase()} already exists for ${data.category.toUpperCase()} category`
        );

      const newCourse = await this.CourseModel.create(props);

      return newCourse.toJSON();
    } catch (error: any) {
      throw new Error(error.message ?? "Failed to create a new course");
    }
  }

  async edit(props: EditCourseType) {
    try {
      const data = validateOption<EditCourseType>(editCourseSchema)(props);
      const course = await this.CourseModel.findOneAndUpdate(
        { id: props.id },
        omit(data, ["id"]),
        { new: true }
      );
      if (!course) throw new Error("no course found");

      return course.toJSON();
    } catch (error: any) {
      throw new Error("Failed to edit this course course");
    }
  }

  async delete(props: DeleteCourseType) {
    try {
      const { id } =
        validateOption<DeleteCourseType>(deleteCourseSchema)(props);
      const course = await this.CourseModel.findOneAndDelete({ _id: id });
      if (!course) throw new Error("no course found");

      return course.toJSON();
    } catch (error: any) {
      throw new Error("Failed to delete this course");
    }
  }

  // /**
  //  * @description find a course by id or course and category
  //  * @param props
  //  * @returns {ICourse} course
  //  */
  async findOne(props: FindOneCourseType) {
    try {
      const { id, course, category } =
        validateOption<FindOneCourseType>(findOneCourseSchema)(props);
      let c;
      if (id) {
        c = await this.CourseModel.findById(id);
      } else if (course && category) {
        c = await this.CourseModel.findOne({
          course,
          category,
        });
      } else {
        throw new Error("Invalid search parameters");
      }
      if (!c) throw new Error("no course found");

      return c;
    } catch (error: any) {
      throw new Error(error.message ?? "Failed to fetch course");
    }
  }

  async findMultiple() {
    try {
      throw new Error("Unimplemented");
    } catch (error: any) {
      throw new Error(error.message ?? "Failed to find courses");
    }
  }
}
