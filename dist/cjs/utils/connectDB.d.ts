import mongoose from "mongoose";
export declare function connectDB(uri: string): mongoose.Connection;
export declare function disconnectDB(connection: ReturnType<typeof connectDB>): void;
