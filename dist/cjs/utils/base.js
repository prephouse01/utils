"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
const config_1 = require("./config");
const connectDB_1 = require("./connectDB");
class Base {
    constructor(props) {
        this.config = (0, config_1.config)(props);
        this.connection = (0, connectDB_1.connectDB)(this.config.DB_URL);
    }
    closeConnection() {
        (0, connectDB_1.disconnectDB)(this.connection);
    }
}
exports.Base = Base;
