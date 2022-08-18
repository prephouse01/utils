"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const env_schema_1 = __importDefault(require("env-schema"));
const schema = {
    title: "config",
    description: "test environment variables",
    properties: {
        DB_URL: {
            type: "string",
        },
        UPLOAD_QUESTION_COST: {
            type: "number",
        },
        REVIEW_QUESTION_COST: {
            type: "number",
        },
    },
};
exports.config = (0, env_schema_1.default)({
    schema,
    dotenv: true,
});
