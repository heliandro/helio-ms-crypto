import { injectable } from 'inversify';
import { Response, Router } from 'express';

@injectable()
export default class HttpHealthController {
    private heathRouter: Router;

    constructor() {
        this.heathRouter = Router();
    }

    router() {
        return this.heathRouter.post('/health', async (req: any, res: Response) => {
            res.status(200).json({ message: 'OK' });
        });
    }
}
