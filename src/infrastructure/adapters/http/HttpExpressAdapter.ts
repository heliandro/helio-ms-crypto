import Express from 'express';
import Cors, { CorsOptions } from 'cors';
import HttpAdapter from '../../../application/ports/inbound/HttpAdapter';
import { injectable } from 'inversify';
import { Server } from 'http';

@injectable()
export default class HttpExpressAdapter implements HttpAdapter {
    private app: Express.Application;
    private PORT: number;
    private WHITE_LIST: string[];
    private server: Server = {} as Server;

    constructor() {
        this.app = Express();
        this.PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
        this.WHITE_LIST = process.env.WHITE_LIST
            ? process.env.WHITE_LIST.split(',')
            : [`http://localhost:${this.PORT}`];
        this.configureExpress();
        this.configureCors();
    }

    private configureExpress() {
        this.app.use(Express.json());
    }

    private configureCors() {
        const corsOptions: CorsOptions = {
            origin: (origin: any, callback) => {
                if (this.WHITE_LIST.indexOf(origin) !== -1 || !origin) {
                    callback(null, true);
                } else {
                    callback(new Error('Não permitido por CORS'));
                }
            }
        };
        this.app.use(Cors(corsOptions));
    }

    setMiddleware(middleware: Express.RequestHandler): this {
        this.app.use(middleware);
        return this;
    }

    registerRouter(apiPath: string, router: Express.Router): this {
        this.app.use(apiPath, router);
        return this;
    }

    runServer() {
        this.server = this.app.listen(this.PORT, () => {
            console.log(`Servidor rodando na porta ${this.PORT}`);
        });
    }

    stopServer() {
        this.server.close();
    }
}
