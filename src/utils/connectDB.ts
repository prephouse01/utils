import mongoose, { connection } from "mongoose";

export function connectDB(uri: string) {
  try {
    const db = mongoose.createConnection(uri);
    console.log("DB connected");
    return db;
  } catch (err: any) {
    console.log(err.message);
    process.exit(1);
  }
}

export function disconnectDB(connection: ReturnType<typeof connectDB>) {
  connection.close();
}

