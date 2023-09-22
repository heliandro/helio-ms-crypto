import { inject, injectable } from 'inversify';
import { Response, Router } from 'express';

import TYPES from '../configuration/Types';

import Decrypt from '../../application/usecases/interfaces/Decrypt';
import { Input, Output } from '../../application/usecases/DecryptUsecase';
import HttpRouterAdapter from '@app/src/application/ports/inbound/HttpRouterAdapter';

@injectable()
export default class HttpDecryptController {
    private decryptRouter: Router;

    constructor(
        @inject(TYPES.DecryptUsecase) readonly decryptUsecase: Decrypt,
        @inject(TYPES.HttpExpressRouterAdapter) readonly routerAdapter: HttpRouterAdapter
    ) {
        this.decryptRouter = this.routerAdapter.createRouter();
    }

    router() {
        return this.decryptRouter.post('/decrypt', async (req: any, res: Response) => {
            this.validateRequestBody(req, res);

            const input: Input = {
                data: req.body.data
            };

            await this.decryptUsecase
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
        if (!req.body?.data) res.status(400).json({ message: 'Invalid data.' });
        if (typeof req.body?.data !== 'string')
            res.status(400).json({ message: 'Property data must be a string.' });
    }
}
