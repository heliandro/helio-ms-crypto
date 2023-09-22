import { Container, injectable } from 'inversify';
import { Response, Router } from 'express';

import TYPES from '../configuration/Types';

import HttpWithMiddlewareRequest from '../interfaces/HttpWithMiddlewareRequest';
import DecryptPort from '../../application/ports/DecryptPort';
import { Input, Output } from '../../application/usecases/Decrypt';

@injectable()
export default class HttpDecryptController {
    private cryptoRouter: Router;

    constructor() {
        this.cryptoRouter = Router();
    }

    router() {
        return this.cryptoRouter.post('/decrypt', async (req: any, res: Response) => {
            this.validateRequestBody(req, res);

            const input: Input = {
                data: req.body.data
            };

            await this.decryptUsecase(req)
                .execute(input)
                .then((output: Output) => {
                    res.status(200).json(output);
                })
                .catch((error: any) => {
                    res.status(500).json({ message: error.message });
                });
        });
    }

    private validateRequestBody(req: any, res: Response) {
        if (!req.body?.data)
            res.status(400).json({ message: 'Invalid data.' });
        if (typeof req.body?.data !== 'string')
            res.status(400).json({ message: 'Property data must be a string.' });
    }

    private decryptUsecase(req: HttpWithMiddlewareRequest) {
        const container = <Container>req.container;
        return container.get<DecryptPort>(TYPES.Decrypt);
    }
}
