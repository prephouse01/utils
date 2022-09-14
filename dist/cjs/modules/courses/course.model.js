"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseModel = void 0;
const mongoose_1 = require("mongoose");
function courseModel(M) {
    const courseSchema = new mongoose_1.Schema({
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
exports.courseModel = courseModel;
