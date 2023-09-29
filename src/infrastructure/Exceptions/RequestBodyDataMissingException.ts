import { HttpStatusCode } from "axios";

export default class RequestBodyDataMissingException extends Error {
    status: number;
    data: any;

    constructor() {
        super('Request body is missing data field');
        this.name = 'RequestBodyDataMissingException';
        this.status = HttpStatusCode.UnprocessableEntity;
        this.data = { message: this.message };
    }
}
