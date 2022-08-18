"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const validateOptions_1 = require("src/utils/validateOptions");
const course_model_1 = require("./course.model");
const course_schema_1 = require("./course.schema");
const lodash_1 = require("lodash");
class Course {
    static create(props) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = (0, validateOptions_1.validateOption)(course_schema_1.createCourseSchema)(props);
                const course = yield course_model_1.CourseModel.findOne({ course: data.course });
                if (course)
                    throw new Error(`Course ${data.course} already exists`);
                return yield course_model_1.CourseModel.create(props);
            }
            catch (error) {
                throw new Error((_a = error.message) !== null && _a !== void 0 ? _a : "Failed to create a new course");
            }
        });
    }
    static edit(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = (0, validateOptions_1.validateOption)(course_schema_1.editCourseSchema)(props);
                yield course_model_1.CourseModel.findOneAndUpdate({ id: props.id }, (0, lodash_1.omit)(data, ["id"]));
            }
            catch (error) {
                throw new Error("Failed to edit this course course");
            }
        });
    }
    static deleteCourse(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = (0, validateOptions_1.validateOption)(course_schema_1.deleteCourseSchema)(props);
                yield course_model_1.CourseModel.findOneAndDelete({ _id: id });
            }
            catch (error) {
                throw new Error("Failed to delete this course");
            }
        });
    }
}
exports.Course = Course;
