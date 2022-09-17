import { Schema } from "mongoose";
import { Developer } from "./developer.interface";

export const developerSchema = new Schema<Developer>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  apiKey: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    first: {
      type: String,
      required: true,
      lowercase: true,
    },
    last: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
});
