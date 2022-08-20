"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminModel = void 0;
const mongoose_1 = require("mongoose");
const creatorPermissions = new mongoose_1.Schema({
    action: {
        type: String,
        enum: ["upload", "review"],
    },
    course: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
    },
    category: {
        type: String,
        lowercase: true,
        trim: true,
        enum: ["primary", "secondary", "tertiary"],
        required: true,
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
});
const adminSchema = new mongoose_1.Schema({
    name: {
        first: { type: String, default: undefined, lowercase: true, trim: true },
        last: { type: String, default: undefined, trim: true, lowercase: true },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    avatar: {
        type: String,
        required: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    contact: { type: String, unique: true, default: undefined },
    role: {
        type: String,
        enum: ["admin", "creator"],
    },
    revenue: {
        total: {
            type: Number,
            default: 0,
        },
        withdrawable: {
            type: Number,
            default: 0,
        },
    },
    creatorPermissions: {
        type: [creatorPermissions],
        default: [],
    },
    notifications: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "Notification",
    },
    token: {
        type: String,
        default: undefined,
    },
    bank: {
        type: String,
    },
    accountName: {
        type: String,
    },
    accountNumber: {
        type: String,
    },
}, {
    timestamps: true,
});
function adminModel(M) {
    return M.model("Admin", adminSchema);
}
exports.adminModel = adminModel;
// export const AdminModel = model<Admin>("Admin", adminSchema);
