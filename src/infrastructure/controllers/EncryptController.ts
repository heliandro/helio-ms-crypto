import { Request, Response, Router } from 'express';
import { Output as EncryptOutput } from '../../application/usecases/Encrypt';
import HttpWithMiddlewareRequest from '../interfaces/HttpWithMiddlewareRequest';
import HttpExpressAdapter from '../adapters/http/HttpExpressAdapter';
import TYPES from '../configuration/Types';
import EncryptPort from '../../application/ports/EncryptPort';
import { Container } from 'inversify';

export default class EncryptController {

    private cryptoRouter: Router;

    constructor() {
        this.cryptoRouter = HttpExpressAdapter.createRouter();
    }

    encrypt(req: any, res: Response) {
        if (!req.body?.data)
            res.status(400).json({ message: 'Invalid data.' });

        let { data } = req.body;

        if (typeof req.body.data !== 'string') 
            data = JSON.stringify(req.body.data);

        const container = <Container>req.container;
        const usecase = container.get<EncryptPort>(TYPES.Encrypt);

        usecase.execute({ data })
            .then((encryptedData: EncryptOutput) => {
                res.status(200).json(encryptedData);
            })
            .catch((error: any) => res.status(500).json({ message: error.message }));
    }

    getEncryptRouter() {
        this.cryptoRouter.post('/encrypt', this.encrypt);
        return this.cryptoRouter;
    }
}