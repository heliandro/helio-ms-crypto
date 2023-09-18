import Express from 'express';
import DependencyInjection from './infrastructure/configuration/DependencyInjection';

import { Container } from 'inversify';

// import Decrypt from './application/usecases/Decrypt';
import HttpExpressAdapter from './infrastructure/adapters/http/HttpExpressAdapter';
// import HttpWithMiddlewareRequest from './infrastructure/interfaces/HttpWithMiddlewareRequest';
import EncryptController from './infrastructure/controllers/EncryptController';
import TYPES from './infrastructure/configuration/Types';
import GenerateKeyPairPort from './application/ports/GenerateKeyPairPort';

(async () => {
    const httpExpressAdapter = new HttpExpressAdapter();
    const container: Container = DependencyInjection.create();
    const generateCryptoKeyPairUsecase = container.get<GenerateKeyPairPort>(TYPES.GenerateKeyPair);
    await generateCryptoKeyPairUsecase.execute().catch((error: any) => console.log(error.message));

    const dependencyInjectionMiddleware = (req: any, res: any, next: any) => {
        req.container = container;
        next();
    }

    const encryptController = new EncryptController();

    httpExpressAdapter
        .setMiddleware(dependencyInjectionMiddleware)
        .registerRouter('/api', encryptController.getEncryptRouter())
        .runServer();
})();


// const cryptoRouter = Express.Router();
// cryptoRouter.post('/decrypt', (req: any, res: any) => {
//     let { data } = req.body;

//     if (typeof data !== 'string') res.status(400).json({ message: 'Invalid data.' });

//     const usecase = req.container.get(Decrypt);
//     return usecase.execute({ data })
//         .then((decryptedData: any) => res.json(decryptedData))
//         .catch((error: any) => res.status(500).json({ message: error.message }));
// });

// const healthRouter = Express.Router();
// healthRouter.get('/health', (req: Express.Request, res: any) => {
//     res.json({ message: 'OK' });
// });

// Application.init()
//     .registerRouter('', healthRouter)
//     .registerRouter('/api', cryptoRouter)
//     .runServer();
