import { inject, injectable } from 'inversify';
import { Response, Router } from 'express';

import TYPES from '../configuration/Types';
import Encrypt from '../../application/usecases/interfaces/Encrypt';
import { Input, Output } from '../../application/usecases/EncryptUsecase';

import HttpRouterAdapter from '@app/src/application/ports/inbound/HttpRouterAdapter';
import RequestBodyDataMissingException from '../Exceptions/RequestBodyDataMissingException';
import { HttpStatusCode } from 'axios';

@injectable()
export default class HttpEncryptController {
    private encryptRouter: Router;

    constructor(
        @inject(TYPES.EncryptUsecase) readonly encryptUsecase: Encrypt,
        @inject(TYPES.HttpExpressRouterAdapter) readonly routerAdapter: HttpRouterAdapter
    ) {
        this.encryptRouter = this.routerAdapter.createRouter();
    }

    router() {
        return this.encryptRouter.post('/encrypt', async (req: any, res: Response) => {
            const error = this.validateRequestBody(req);
            if (error) return res.status(error.status).json(error.data);

            try {
                const input: Input = this.mapperDataToInput(req.body.data);
                const output: Output = await this.encryptUsecase.execute(input);
                return res.status(HttpStatusCode.Ok).json(output);                
            } catch (error: any) {
                return res.status(HttpStatusCode.InternalServerError).json({ message: error.message });
            }
        });
    }

    private validateRequestBody(req: any) {
        if (!req.body.data) return new RequestBodyDataMissingException();
    }

    private mapperDataToInput(data: any) {
        if (typeof data !== 'string') return { data: JSON.stringify(data) };
        return { data };
    }
}
