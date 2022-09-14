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
        // this.updateQuestions();
    }
    // async updateQuestions() {
    //   await this.QuestionModel.updateMany(
    //     {},
    //     {
    //       // $set: { "stats.difficulty": 0 },
    //       $unset: { difficulty: "" },
    //     }
    //   );
    //   // for (let i = 0; i < questions.length; i++) {
    //   //   const q = questions[i];
    //   //   try {
    //   //     const c = await this.CourseModel.findOne({
    //   //       course: q.course,
    //   //       category: q.category,
    //   //     });
    //   //     if (!c) {
    //   //       console.error(`no course found for ${q._id}`);
    //   //       await q.remove();
    //   //       continue;
    //   //     }
    //   //     q.course = c._id;
    //   //     await q.save();
    //   //   } catch (e: any) {
    //   //     console.error(`error occured found for ${q._id}`);
    //   //   }
    //   // }
    // }
    /**
     *
     * @param props
     * @returns
     */
    find(props) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, select = "" } = (0, validateOptions_1.validateOption)(question_schema_1.findQuestionSchema)(props);
                let res;
                if (typeof id === "string") {
                    res = yield this.QuestionModel.findById(id, Object.assign({}, props.projection));
                    yield this.QuestionModel.populate(res, { path: "course", select });
                }
                else if (Array.isArray(id)) {
                    res = yield this.QuestionModel.find({ _id: { $in: id } }, Object.assign({}, props.projection));
                    yield this.QuestionModel.populate(res, { path: "course", select });
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
                let questions = this.QuestionModel.find(query, fields)
                    .populate("course")
                    .lean();
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { answers } = (0, validateOptions_1.validateOption)(question_schema_1.questionAnswerSchema)(props);
                let res = [];
                let passed = 0;
                let failed = 0;
                let invalidAnswers = 0;
                if (!Array.isArray(answers))
                    throw new Error("Invalid input");
                for (let i = 0; i < answers.length; i++) {
                    const { questionId, answerId } = answers[i];
                    const question = yield this.QuestionModel.findById(questionId);
                    if (!question)
                        throw new Error("Question not found");
                    // check if answerid is part of the options
                    const opts = question.options.filter((opt) => opt._id.toString() === answerId.toString());
                    if (opts.length === 0) {
                        invalidAnswers++;
                        continue;
                    }
                    const isCorrect = question.answer.toString() === answerId.toString();
                    res.push(Object.assign(Object.assign({}, answers[i]), { isCorrect }));
                    /**
                     * difficulty starts counting once a question has been answered more than 100 times.
                     *
                     * we calculate the difficulty with the difficulty index.
                     * i.e difficulty = passed / total
                     *
                     * 0.00 - 0.20 = very difficult
                     * 0.21 - 0.80 = moderately difficult
                     * 0.81 - 1.00 = very easy
                     */
                    const total = ((_b = (_a = question.stats) === null || _a === void 0 ? void 0 : _a.passed) !== null && _b !== void 0 ? _b : 0) + ((_d = (_c = question.stats) === null || _c === void 0 ? void 0 : _c.failed) !== null && _d !== void 0 ? _d : 0) + 1;
                    if (isCorrect) {
                        const diff = ((((_f = (_e = question.stats) === null || _e === void 0 ? void 0 : _e.passed) !== null && _f !== void 0 ? _f : 0) + 1) / total).toFixed(2);
                        yield this.QuestionModel.findByIdAndUpdate(questionId, {
                            $inc: {
                                "stats.passed": 1,
                            },
                            "stats.difficulty": total > 100 ? diff : 1,
                        });
                        passed++;
                    }
                    else {
                        const diff = (((_h = (_g = question.stats) === null || _g === void 0 ? void 0 : _g.passed) !== null && _h !== void 0 ? _h : 0) / total).toFixed(2);
                        yield this.QuestionModel.findByIdAndUpdate(questionId, {
                            $inc: {
                                "stats.failed": 1,
                            },
                            "stats.difficulty": total > 100 ? diff : 1,
                        });
                        failed++;
                    }
                }
                return { answers: res, passed, failed, invalidAnswers };
            }
            catch (error) {
                throw new Error((_j = error.message) !== null && _j !== void 0 ? _j : "Failed to answer question");
            }
        });
    }
    generate(_a) {
        var _b;
        var { difficulty = 0.7, qty } = _a, props = __rest(_a, ["difficulty", "qty"]);
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = Object.assign(Object.assign({}, props), { difficulty });
                let course = yield this.CourseModel.findById(params.course);
                if (!course)
                    throw new Error("No course found");
                const keys = Object.keys(params);
                // if an examtype is provided, check if the course supports it
                // if it dosen't, pick an examtype from the course at random
                if (keys.includes("examType") &&
                    params["examType"] &&
                    !course.examTypes.includes(params["examType"]))
                    params["examType"] =
                        course.examTypes[Math.floor(Math.random() * course.examTypes.length)];
                //@ts-ignore
                let match = {
                // course: props.course,
                // qty: props.qty,
                // difficulty: props.difficulty,
                // examType: props.examType,
                };
                for (let i = 0; i < keys.length; i++) {
                    if (keys[i] === "course") {
                        match.course = { $eq: course._id };
                        continue;
                    }
                    if (keys[i] === "difficulty") {
                        match.difficulty = { $eq: params[keys[i]] };
                        continue;
                    }
                    match[keys[i]] = { $eq: params[keys[i]] };
                }
                // monitor while loop
                let lap = 1;
                /**
                 *
                 *
                 * STEP 1: fetch with the query the user provided
                 * STEP 2: fetch with a lower difficulty
                 * STEP 3: fetch with the other examTypes with a difficulty less than or equal to
                 *         the current difficulty
                 * STEP 4: fetch with other courses in the same category with a difficulty lower
                 *         or equal to the current difficulty
                 *
                 *
                 */
                const project = {
                    instruction: 1,
                    _id: 1,
                    course: 1,
                    examType: 1,
                    category: 1,
                    question: 1,
                    topic: 1,
                    options: 1,
                };
                let questions = [];
                let parsedCourses = [course._id];
                // run the while loop a maximum of 5 times
                while (questions.length < qty || lap > 5) {
                    if (!course)
                        break;
                    let activeCourse = course;
                    if (lap > 1) {
                        const courses = yield this.CourseModel.aggregate([
                            {
                                $match: {
                                    _id: { $nin: parsedCourses },
                                    category: course.category,
                                },
                            },
                            { $sample: { size: 1 } },
                        ]).exec();
                        if (courses.length === 0)
                            break;
                        // @ts-ignore
                        activeCourse = courses[0];
                        parsedCourses.push(activeCourse._id);
                        match.course = activeCourse._id;
                    }
                    // $expr{
                    //   $ne: ["$_id", { $toObjectId: course._id }],
                    // }
                    let matchs = [];
                    for (let i = 0; i < keys.length; i++) {
                        if (i === 0) {
                            const { course: c, difficulty } = match, others = __rest(match, ["course", "difficulty"]);
                            matchs.push(Object.assign(Object.assign({}, others), { "stats.difficulty": { $eq: params.difficulty }, $expr: {
                                    $eq: ["$course", { $toObjectId: activeCourse._id }],
                                } }));
                            continue;
                        }
                        if (i === 1) {
                            const { course: c, difficulty } = match, others = __rest(match, ["course", "difficulty"]);
                            matchs.push(Object.assign(Object.assign({}, others), { "stats.difficulty": { $lt: params.difficulty }, $expr: {
                                    $eq: ["$course", { $toObjectId: activeCourse._id }],
                                } }));
                            continue;
                        }
                        if (i === 2 && keys.includes("examType")) {
                            const { course: c, difficulty } = match, others = __rest(match, ["course", "difficulty"]);
                            const cat = activeCourse.examTypes.filter(
                            // @ts-ignore
                            (c) => c !== params["examType"]);
                            matchs.push({
                                examType: { $in: cat },
                                "stats.difficulty": { $lte: params.difficulty },
                                $expr: {
                                    $eq: ["$course", { $toObjectId: activeCourse._id }],
                                },
                            });
                            continue;
                        }
                    }
                    const quests = yield Promise.all(matchs.map((x) => this.QuestionModel.aggregate([
                        {
                            $match: x,
                        },
                        { $project: project },
                        { $sample: { size: qty - questions.length } },
                    ]).exec()));
                    quests.forEach((q) => {
                        questions = questions.concat(q);
                    });
                    questions = questions.slice(0, qty);
                    yield this.QuestionModel.populate(questions, {
                        path: "course",
                        select: "avatar course category",
                    });
                    lap++;
                }
                return questions;
            }
            catch (error) {
                throw new Error((_b = error.message) !== null && _b !== void 0 ? _b : "Failed to generate question");
            }
        });
    }
}
exports.Question = Question;
