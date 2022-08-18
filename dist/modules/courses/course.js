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
const course_model_1 = require("./course.model");
const course_schema_1 = require("./course.schema");
const lodash_1 = require("lodash");
const validateOptions_1 = require("../../utils/validateOptions");
const config_1 = require("../../utils/config");
const connectDB_1 = require("../../utils/connectDB");
class Course {
    constructor(props) {
        this.config = (0, config_1.config)(props);
        this.connection = (0, connectDB_1.connectDB)(this.config.DB_URL);
        this.CourseModel = (0, course_model_1.courseModel)(this.connection);
    }
    create(props) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // verify input schema
                const data = (0, validateOptions_1.validateOption)(course_schema_1.createCourseSchema)(props);
                // create new course
                const course = yield this.CourseModel.findOne({
                    course: data.course,
                    category: data.category,
                });
                if (course)
                    throw new Error(`${data.course.toUpperCase()} already exists for ${data.category.toUpperCase()} category`);
                const newCourse = yield this.CourseModel.create(props);
                (0, connectDB_1.disconnectDB)(this.connection);
                return newCourse.toJSON();
            }
            catch (error) {
                (0, connectDB_1.disconnectDB)(this.connection);
                return new Error((_a = error.message) !== null && _a !== void 0 ? _a : "Failed to create a new course");
            }
        });
    }
    edit(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = (0, validateOptions_1.validateOption)(course_schema_1.editCourseSchema)(props);
                const course = yield this.CourseModel.findOneAndUpdate({ id: props.id }, (0, lodash_1.omit)(data, ["id"]), { new: true });
                if (!course)
                    throw new Error("no course found");
                (0, connectDB_1.disconnectDB)(this.connection);
                return course.toJSON();
            }
            catch (error) {
                (0, connectDB_1.disconnectDB)(this.connection);
                return new Error("Failed to edit this course course");
            }
        });
    }
    delete(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = (0, validateOptions_1.validateOption)(course_schema_1.deleteCourseSchema)(props);
                const course = yield this.CourseModel.findOneAndDelete({ _id: id });
                if (!course)
                    throw new Error("no course found");
                (0, connectDB_1.disconnectDB)(this.connection);
                return course.toJSON();
            }
            catch (error) {
                (0, connectDB_1.disconnectDB)(this.connection);
                return new Error("Failed to delete this course");
            }
        });
    }
    /**
     * @description find a course by id or course and category
     * @param props
     * @returns {ICourse} course
     */
    findOne(props) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, course, category } = (0, validateOptions_1.validateOption)(course_schema_1.findOneCourseSchema)(props);
                let c;
                if (id) {
                    c = yield this.CourseModel.findById(id);
                }
                else if (course && category) {
                    c = yield this.CourseModel.findOne({
                        course,
                        category,
                    });
                }
                else {
                    throw new Error("Invalid search parameters");
                }
                if (!c)
                    throw new Error("no course found");
                (0, connectDB_1.disconnectDB)(this.connection);
                return c;
            }
            catch (error) {
                (0, connectDB_1.disconnectDB)(this.connection);
                return new Error((_a = error.message) !== null && _a !== void 0 ? _a : "Failed to fetch course");
            }
        });
    }
    findMultiple() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                throw new Error("Unimplemented");
            }
            catch (error) {
                (0, connectDB_1.disconnectDB)(this.connection);
                return new Error((_a = error.message) !== null && _a !== void 0 ? _a : "Failed to find courses");
            }
        });
    }
}
exports.Course = Course;
