import mongoose from "mongoose";
import { config } from "./config";

export async function connectDB() {
  try {
    const db = await mongoose.connect(config.DB_URL);
    return db;
  } catch (err: any) {
    console.log(err);
    process.exit(1);
  }
}
