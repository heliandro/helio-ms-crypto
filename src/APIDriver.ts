import { Container } from 'inversify';
import DependencyInjection from './infrastructure/configuration/DependencyInjection';

import HttpEncryptController from './infrastructure/controllers/HttpEncryptController';
import TYPES from './infrastructure/configuration/Types';
import GenerateKeyPairPort from './application/ports/GenerateKeyPairPort';
import HttpAdapter from './application/ports/adapters/HttpAdapter';

(async () => {
    const container: Container = DependencyInjection.createHttp();
    const httpExpressAdapter = container.get<HttpAdapter>(TYPES.HttpExpressAdapter);
    const httpEncryptController = container.get<HttpEncryptController>(TYPES.HttpEncryptController);
    const generateCryptoKeyPairUsecase = container.get<GenerateKeyPairPort>(TYPES.GenerateKeyPair);
    
    await generateCryptoKeyPairUsecase.execute().catch((error: any) => console.log(error.message));

    const dependencyInjectionMiddleware = (req: any, res: any, next: any) => {
        req.container = container;
        next();
    };

    httpExpressAdapter
        .setMiddleware(dependencyInjectionMiddleware)
        .registerRouter('/api', httpEncryptController.getEncryptRouter())
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
