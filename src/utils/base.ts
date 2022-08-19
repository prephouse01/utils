import { config, Env } from "./config";
import { connectDB, disconnectDB } from "./connectDB";

export class Base {
  config: Env;
  connection: ReturnType<typeof connectDB>;
  constructor(props: Env) {
    this.config = config(props);
    this.connection = connectDB(this.config.DB_URL);
  }

  closeConnection() {
    disconnectDB(this.connection);
  }
}
