export declare type Env = {
    DB_URL: string;
    UPLOAD_QUESTION_COST: number;
    REVIEW_QUESTION_COST: number;
};
export declare function config(data: Env): Env;
