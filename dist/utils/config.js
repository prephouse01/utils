"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const env_schema_1 = __importDefault(require("env-schema"));
function config(data) {
    const schema = {
        title: "config",
        type: "object",
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
    const config = (0, env_schema_1.default)({
        schema,
        data: data,
    });
    return config;
}
exports.config = config;
