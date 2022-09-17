import { courseModel } from "./course.model";
import {
  createCourseSchema,
  CreateCourseType,
  deleteCourseSchema,
  DeleteCourseType,
  editCourseSchema,
  EditCourseType,
  findMultipleCourseSchema,
  FindMultipleCourseType,
  findOneCourseSchema,
  FindOneCourseType,
} from "./course.schema";
import { omit } from "lodash";
import { validateOption } from "../../utils/validateOptions";
import { Env } from "../../utils/config";
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

      return newCourse;
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

      return course;
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

      return course;
    } catch (error: any) {
      throw new Error("Failed to delete this course");
    }
  }

  /**
   * @description
   * find a course using the following parameters in order of prefrence
   * - id
   * - course and category
   * @returns
   * a course or null
   */
  async findOne(props: FindOneCourseType) {
    try {
      const { id, course, category } = validateOption<
        FindOneCourseType,
        typeof findOneCourseSchema
      >(findOneCourseSchema)(props);

      let c = null;

      if (id) {
        c = await this.CourseModel.findById(id);
      } else if (course && category) {
        c = await this.CourseModel.findOne({
          course,
          category,
        });
      }

      return c;
    } catch (error: any) {
      throw new Error(error.message ?? "Failed to fetch course");
    }
  }

  /**
   * @description
   * Find multiple courses using the following conditions in order of prefrence
   * 1. Without a parameter
   * 2. By Id's
   * 3. By category
   * 4. By course title
   *
   * @returns an array of courses or an empty array
   * */

  async findMultiple(props: FindMultipleCourseType) {
    try {
      const params = validateOption<FindMultipleCourseType>(
        findMultipleCourseSchema
      )(props);

      const keys = Object.keys(params);
      let courses: ICourse[] = [];
      if (keys.length === 0) courses = await this.CourseModel.find();
      else {
        if (params["ids"])
          courses = await this.CourseModel.find({
            _id: { $in: params["ids"] },
          });
        else if (params["category"])
          courses = await this.CourseModel.find({
            category: { $eq: params["category"] },
          });
        else if (params["course"])
          courses = await this.CourseModel.find({
            course: { $in: params["course"] },
          });
      }

      return courses;
    } catch (error: any) {
      throw new Error(error.message ?? "Failed to find courses");
    }
  }
}
