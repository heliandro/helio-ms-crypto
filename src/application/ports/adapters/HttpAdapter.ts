import * as Express from 'express';

export default interface HttpAdapter {
    setMiddleware(middleware: Express.RequestHandler): this;
    registerRouter(apiPath: string, router: Express.Router): this;
    runServer(): void;
}
