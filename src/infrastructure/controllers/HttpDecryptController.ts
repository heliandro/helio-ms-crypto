import { inject, injectable } from 'inversify';
import { Response, Router } from 'express';

import TYPES from '../configuration/Types';

import Decrypt from '../../application/usecases/interfaces/Decrypt';
import { Input, Output } from '../../application/usecases/DecryptUsecase';
import HttpRouterAdapter from '@app/src/application/ports/inbound/HttpRouterAdapter';
import RequestBodyDataMissingException from '../Exceptions/RequestBodyDataMissingException';
import { HttpStatusCode } from 'axios';
import RequestBodyDataNoStringException from '../Exceptions/RequestBodyDataNoStringException';

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
            const error = this.validateRequestBody(req);
            if (error) return res.status(error.status).json(error.data);

            try {
                const input: Input = { data: req.body.data };
                const output: Output = await this.decryptUsecase.execute(input);
                return res.status(HttpStatusCode.Ok).json(output);
            } catch (error: any) {
                return res.status(HttpStatusCode.InternalServerError).json({ message: error.message });
            }
        });
    }

    private validateRequestBody(req: any) {
        if (!req.body.data) return new RequestBodyDataMissingException();
        if (typeof req.body?.data !== 'string') return new RequestBodyDataNoStringException();
    }
}
