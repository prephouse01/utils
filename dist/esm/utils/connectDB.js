"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
function connectDB(uri) {
    try {
        const db = mongoose_1.default.createConnection(uri);
        return db;
    }
    catch (err) {
        process.exit(1);
    }
}
exports.connectDB = connectDB;
function disconnectDB(connection) {
    connection.close();
}
exports.disconnectDB = disconnectDB;
