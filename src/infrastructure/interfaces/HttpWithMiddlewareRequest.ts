import Express from "express";

export default interface HttpWithMiddlewareRequest extends Express.Request {
    container: any;
}