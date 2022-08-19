import mongoose from "mongoose";

export function connectDB(uri: string) {
  try {
    const db = mongoose.createConnection(uri);
    return db;
  } catch (err: any) {
    process.exit(1);
  }
}

export function disconnectDB(connection: ReturnType<typeof connectDB>) {
  connection.close();
}
