import { injectable } from 'inversify';
import { Response, Router } from 'express';
import { HttpStatusCode } from 'axios';

@injectable()
export default class HttpHealthController {
    private heathRouter: Router;

    constructor() {
        this.heathRouter = Router();
    }

    router() {
        return this.heathRouter.get('/health', async (_req, res: Response) => {
            res.status(HttpStatusCode.Ok).json({ message: 'OK' });
        });
    }
}
