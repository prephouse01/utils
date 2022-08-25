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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const question_schema_1 = require("./question.schema");
const lodash_1 = require("lodash");
const admin_1 = require("../admin");
const validateOptions_1 = require("../../utils/validateOptions");
const base_1 = require("../../utils/base");
const question_model_1 = require("./question.model");
const courses_1 = require("../courses");
class Question extends base_1.Base {
    constructor(props) {
        super(props);
        this.QuestionModel = (0, question_model_1.questionModel)(this.connection);
        this.AdminModel = (0, admin_1.adminModel)(this.connection);
        this.CourseModel = (0, courses_1.courseModel)(this.connection);
        this.updateQuestions();
    }
    updateQuestions() {
        return __awaiter(this, void 0, void 0, function* () {
            const questions = yield this.QuestionModel.find();
            for (let i = 0; i < questions.length; i++) {
                const q = questions[i];
                try {
                    const c = yield this.CourseModel.findOne({
                        course: q.course,
                        category: q.category,
                    });
                    if (!c) {
                        console.error(`no course found for ${q._id}`);
                        yield q.remove();
                        continue;
                    }
                    q.course = c._id;
                    yield q.save();
                }
                catch (e) {
                    console.error(`error occured found for ${q._id}`);
                }
            }
        });
    }
    /**
     *
     * @param props
     * @returns
     */
    find(props) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = (0, validateOptions_1.validateOption)(question_schema_1.findQuestionSchema)(props);
                let res;
                if (typeof id === "string") {
                    res = yield this.QuestionModel.findById(id, {
                        _id: 0,
                        __v: 0,
                    }).populate("course");
                }
                else if (Array.isArray(id)) {
                    res = yield this.QuestionModel.find({ _id: { $in: id } }, {
                        _id: 0,
                        __v: 0,
                    }).populate("course");
                }
                return res;
            }
            catch (error) {
                throw new Error((_a = error.message) !== null && _a !== void 0 ? _a : "Didn't find a question");
            }
        });
    }
    fetchAllMetadata(props) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { query } = props;
            try {
                const fields = {
                    course: 1,
                    category: 1,
                    examType: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    lastEditedOn: 1,
                    lastReviewedOn: 1,
                };
                let questions = this.QuestionModel.find(query, fields).populate("Course").lean();
                return questions;
            }
            catch (error) {
                throw new Error((_a = error.message) !== null && _a !== void 0 ? _a : "Failed to fetch questions");
            }
        });
    }
    /**
     *
     * @param props
     * @returns
     */
    upload(props) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { question, uploadedBy } = (0, validateOptions_1.validateOption)(question_schema_1.questionUploadSchema)(props);
                const course = yield this.CourseModel.findById(question.course);
                if (!course)
                    throw new Error("This course dosen't exist");
                const { answer } = question, rest = __rest(question, ["answer"]);
                const upload_cost = this.config.UPLOAD_QUESTION_COST / 2;
                // UPLOAD QUESTION
                const newQuestion = yield new this.QuestionModel(Object.assign(Object.assign({}, rest), { options: rest.options.map((option) => ({ option })), reviewPending: true, uploadedBy })).save();
                // SET THE ANSWER
                newQuestion.answer = newQuestion.options[answer]._id;
                yield newQuestion.save();
                // CREDIT UPLOADER ACCOUNT
                yield this.AdminModel.findByIdAndUpdate(uploadedBy, {
                    $inc: {
                        "revenue.total": upload_cost,
                    },
                });
                return newQuestion;
            }
            catch (error) {
                throw new Error((_a = error.message) !== null && _a !== void 0 ? _a : "Failed to upload question");
            }
        });
    }
    /**
     *
     * @param props
     * @returns
     */
    review(props) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, passed, reviewerId, message } = (0, validateOptions_1.validateOption)(question_schema_1.questionReviewSchema)(props);
                let question;
                const existingQuestion = yield this.QuestionModel.findById(id);
                if (!existingQuestion)
                    throw new Error("Question not found");
                if (!existingQuestion.reviewPending)
                    throw new Error("Question is not pending review");
                let update = {};
                const upload_cost = this.config.UPLOAD_QUESTION_COST / 2;
                const review_cost = this.config.REVIEW_QUESTION_COST / 2;
                // question hasn't been reviewed before
                if (!existingQuestion.lastReviewedBy) {
                    update = {
                        reviewedBy: reviewerId,
                        // lastReviewedBy: reviewerId,
                    };
                }
                // question has been reviewed before
                else {
                    update = {
                        lastReviewedBy: reviewerId,
                    };
                }
                // QUESTION PASSED REVIEW
                if (passed) {
                    question = yield this.QuestionModel.findByIdAndUpdate(id, Object.assign({ reviewPending: false, reviewed: true, lastEditedBy: (_a = existingQuestion.lastEditedBy) !== null && _a !== void 0 ? _a : existingQuestion.uploadedBy, lastEditedOn: new Date(), lastReviewedOn: new Date() }, update), { new: true });
                    if (!question)
                        throw new Error("Failed to review question");
                    // IF THE QUESTION PASSES REVIEW ON FIRST GO
                    if (!existingQuestion.lastEditedBy) {
                        // CREDIT UPLOADER ACCOUNT
                        yield this.AdminModel.findByIdAndUpdate(existingQuestion.uploadedBy, {
                            $inc: {
                                // "revenue.total": upload_cost,
                                "revenue.total": -1 * upload_cost,
                                "revenue.withdrawable": upload_cost * 2,
                            },
                        });
                        // CREDIT REVIEWER ACCOUNT
                        yield this.AdminModel.findByIdAndUpdate(reviewerId, {
                            $inc: {
                                "revenue.withdrawable": review_cost * 2,
                            },
                        });
                    }
                    // THIS ISN'T THE FIRST TIME THE QUESTION HAS BEEN REVIEWED
                    else {
                        // UNCREDIT LAST REVIEWER ACCOUNT
                        yield this.AdminModel.findByIdAndUpdate(existingQuestion.lastReviewedBy, {
                            $inc: {
                                "revenue.total": -1 * review_cost,
                            },
                        });
                        // CREDIT UPLOADER ACCOUNT
                        yield this.AdminModel.findByIdAndUpdate(existingQuestion.uploadedBy, {
                            $inc: {
                                "revenue.toal": -1 * upload_cost,
                                "revenue.withdrawable": upload_cost,
                            },
                        });
                        // CREDIT LAST EDITOR ACCOUNT
                        yield this.AdminModel.findByIdAndUpdate(existingQuestion.lastEditedBy, {
                            $inc: {
                                "revenue.total": -1 * upload_cost,
                                "revenue.withdrawable": upload_cost,
                            },
                        });
                        // CREDIT REVIEWER ACCOUNT
                        yield this.AdminModel.findByIdAndUpdate(reviewerId, {
                            $inc: {
                                "revenue.withdrawable": review_cost,
                            },
                        });
                    }
                    // UPDATE LAST REVIEWED BY
                    question.lastReviewedBy = reviewerId;
                    yield question.save();
                }
                // QUESTION FAILED REVIEW
                // MESSAGE IS SENT HERE
                else {
                    question = yield this.QuestionModel.findByIdAndUpdate(id, {
                        $set: Object.assign({ reviewPending: false, reviewed: false, lastReviewedOn: new Date() }, update),
                        $push: { messages: { message, from: reviewerId } },
                    }, { new: true });
                    if (!question)
                        throw new Error("Failed to review question");
                    // QUESTION HAS BEEN REVIEWED BEFORE
                    if (existingQuestion.lastEditedBy) {
                        // UNCREDIT LAST REVIEWER ACCOUNT
                        yield this.AdminModel.findByIdAndUpdate(existingQuestion.lastReviewedBy, {
                            $inc: {
                                "revenue.total": -1 * review_cost,
                            },
                        });
                    }
                    // SET LAST REVIEWED BY
                    question.lastReviewedBy = reviewerId;
                    yield question.save();
                    // CREDIT REVIEWER ACCOUNT
                    yield this.AdminModel.findByIdAndUpdate(reviewerId, {
                        $inc: {
                            "revenue.total": review_cost,
                        },
                    });
                }
                return question;
            }
            catch (error) {
                throw new Error((_b = error.message) !== null && _b !== void 0 ? _b : "Failed to review questions");
            }
        });
    }
    /**
     *
     * @param props
     * @returns
     */
    edit(props) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { questionId, editedBy } = (0, validateOptions_1.validateOption)(question_schema_1.questionEditSchema)(props);
                const question = (0, lodash_1.pick)(props.question, [
                    "course",
                    "instructions",
                    "answer",
                    "question",
                    "topic",
                    "year",
                    "options",
                ]);
                const { answer, options } = question, rest = __rest(question, ["answer", "options"]);
                const upload_cost = parseFloat(process.env.UPLOAD_QUESTION_COST) / 2;
                const existingQuestion = yield this.QuestionModel.findById(questionId);
                if (!existingQuestion)
                    throw new Error("Question not found");
                // QUESTION HAS BEEN EDITED BEFORE
                if (existingQuestion.lastEditedBy) {
                    // UNCREDIT LAST EDITOR ACCOUNT
                    yield this.AdminModel.findByIdAndUpdate(existingQuestion.lastEditedBy, {
                        $inc: {
                            "revenue.total": -1 * upload_cost,
                        },
                    });
                }
                // if(existingQuestion.uploadedBy !== editedBy) throw new HttpException("You can't edit this question")
                const newQuestion = yield this.QuestionModel.findByIdAndUpdate(questionId, Object.assign(Object.assign({}, rest), { options: options.map((option) => ({ option })), reviewPending: true, reviewed: false, lastEditedBy: editedBy }), { new: true });
                if (!newQuestion)
                    throw new Error("Failed to edit question");
                // SET THE ANSWER
                newQuestion.answer = newQuestion.options[answer]._id;
                newQuestion.lastEditedOn = new Date();
                yield newQuestion.save();
                // CREDIT EDITOR ACCOUNT
                yield this.AdminModel.findByIdAndUpdate(editedBy, {
                    $inc: {
                        "revenue.total": upload_cost,
                    },
                });
                return newQuestion;
            }
            catch (error) {
                throw new Error((_a = error.message) !== null && _a !== void 0 ? _a : "Failed to create new questions");
            }
        });
    }
    sendMessage(props) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { questionId, message, reviewerId } = (0, validateOptions_1.validateOption)(question_schema_1.questionSendMessageSchema)(props);
                const msg = yield this.QuestionModel.findByIdAndUpdate(questionId, {
                    $push: { messages: message, from: reviewerId },
                }, { new: true });
                if (!msg)
                    throw new Error("Failed to send message");
                return msg;
            }
            catch (error) {
                throw new Error((_a = error.message) !== null && _a !== void 0 ? _a : "Failed to send message");
            }
        });
    }
    answer(props) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { answers } = (0, validateOptions_1.validateOption)(question_schema_1.questionAnswerSchema)(props);
                let res = [];
                if (Array.isArray(answers)) {
                    for (let i = 0; i < answers.length; i++) {
                        const { questionId, answerId } = answers[i];
                        const question = yield this.QuestionModel.findById(questionId);
                        if (!question)
                            throw new Error("Question not found");
                        const isCorrect = question.answer.toString() === answerId.toString();
                        res.push(Object.assign(Object.assign({}, answers[i]), { isCorrect }));
                        if (isCorrect) {
                            yield this.QuestionModel.findByIdAndUpdate(questionId, {
                                $inc: {
                                    "stats.passed": 1,
                                },
                            });
                        }
                        else {
                            yield this.QuestionModel.findByIdAndUpdate(questionId, {
                                $inc: {
                                    "stats.failed": 1,
                                },
                            });
                        }
                    }
                }
                return res;
            }
            catch (error) {
                throw new Error((_a = error.message) !== null && _a !== void 0 ? _a : "Failed to answer question");
            }
        });
    }
}
exports.Question = Question;
