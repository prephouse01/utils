import { model, Schema } from "mongoose";
import { Admin } from "./admin.interface";

const creatorPermissions = new Schema({
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

const adminSchema = new Schema<Admin>(
  {
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
    notifications: {
      type: [Schema.Types.ObjectId],
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
  },
  {
    timestamps: true,
  }
);

export const AdminModel = model<Admin>("Admin", adminSchema);
