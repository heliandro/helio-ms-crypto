import Express from "express";
import cors from "cors";

export default class HttpExpressAdapter {
    private app: Express.Application;
    private PORT: number;

    constructor() {
        this.app = Express();
        this.PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
        this.configureExpress();
    }

    static createRouter() {
        return Express.Router();
    }

    private configureExpress() {
        this.app.use(Express.json());
        // this.app.use(cors({ origin: ['http://localhost:3000'] } ));
        this.app.use(cors());
    }

    setMiddleware(middleware: Express.RequestHandler) {
        this.app.use(middleware);
        return this;
    }

    registerRouter(apiPath: string, router: Express.Router) {
        this.app.use(apiPath, router);
        return this;
    }

    runServer() {
        this.app.listen(this.PORT, () => {
            console.log(`Server running on port ${this.PORT}`);
        });
    }
}