import * as Express from 'express';

export default interface HttpAdapter {
    createRouter(): Express.Router;
    setMiddleware(middleware: Express.RequestHandler): this;
    registerRouter(apiPath: string, router: Express.Router): this;
    runServer(): void;
}
