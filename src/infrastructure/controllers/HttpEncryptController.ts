import { Container, injectable } from 'inversify';
import { Response, Router } from 'express';

import TYPES from '../configuration/Types';
import Encrypt from '../../application/usecases/interfaces/Encrypt';
import { Input, Output } from '../../application/usecases/EncryptUsecase';

import HttpWithMiddlewareRequest from '../interfaces/HttpWithMiddlewareRequest';

@injectable()
export default class HttpEncryptController {
    private encryptRouter: Router;

    constructor() {
        this.encryptRouter = Router();
    }

    router() {
        return this.encryptRouter.post('/encrypt', async (req: any, res: Response) => {
            this.validateRequestBody(req, res);

            const input: Input = {
                data: this.mapperData(req.body.data)
            };

            await this.encryptUsecase(req)
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
    }

    private mapperData(data: any) {
        if (typeof data !== 'string') return JSON.stringify(data);
        return data;
    }

    private encryptUsecase(req: HttpWithMiddlewareRequest) {
        const container = <Container>req.container;
        return container.get<Encrypt>(TYPES.EncryptUsecase);
    }
}
