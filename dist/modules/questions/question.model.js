"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionModel = void 0;
const mongoose_1 = require("mongoose");
function questionModel(M) {
    const Message = new mongoose_1.Schema({
        message: { type: String, required: true, maxLength: 150 },
        from: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Admin",
        },
    }, {
        timestamps: true,
    });
    const questionSchema = new mongoose_1.Schema({
        course: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        instruction: {
            type: String,
            default: undefined,
        },
        examType: {
            type: String,
            trim: true,
            lowercase: true,
            default: "prephouse",
        },
        category: {
            type: String,
            lowercase: true,
            trim: true,
            enum: ["primary", "secondary", "tertiary"],
            required: true,
        },
        answer: {
            type: String,
        },
        question: {
            type: String,
            required: true,
        },
        topic: {
            type: String,
            required: true,
        },
        year: {
            type: String,
        },
        options: {
            type: [{ option: String }],
            required: true,
        },
        stats: {
            passed: {
                type: Number,
                default: 0,
            },
            failed: {
                type: Number,
                default: 0,
            },
            difficulty: {
                type: String,
                default: "",
            },
        },
        messages: {
            type: [Message],
            default: [],
        },
        lastReviewedBy: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Admin",
        },
        lastEditedBy: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Admin",
        },
        reviewedBy: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Admin",
        },
        uploadedBy: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Admin",
        },
        reviewed: {
            type: Boolean,
            default: false,
        },
        reviewPending: {
            type: Boolean,
            default: false,
        },
        lastReviewedOn: Date,
        lastEditedOn: Date,
    }, {
        timestamps: true,
    });
    return M.model("Question", questionSchema);
}
exports.questionModel = questionModel;
// export QuestionModel;
