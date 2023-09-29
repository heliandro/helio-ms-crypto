import { HttpStatusCode } from "axios";

export default class RequestBodyDataNoStringException extends Error {
    status: number;
    data: any;

    constructor() {
        super('Request body data field must be a string');
        this.name = 'RequestBodyDataNoStringException';
        this.status = HttpStatusCode.UnprocessableEntity;
        this.data = { message: this.message };
    }
}
