"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOption = void 0;
function validateOption(schema) {
    return (input) => {
        const res = schema.parse(input);
        return res;
    };
}
exports.validateOption = validateOption;
