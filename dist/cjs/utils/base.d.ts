import { Env } from "./config";
import { connectDB } from "./connectDB";
export declare class Base {
    config: Env;
    connection: ReturnType<typeof connectDB>;
    constructor(props: Env);
    closeConnection(): void;
}
