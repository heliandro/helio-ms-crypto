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
    const httpDecryptController = container.get<HttpEncryptController>(TYPES.HttpDecryptController);
    const httpHealthController = container.get<HttpEncryptController>(TYPES.HttpHealthController);
    const generateCryptoKeyPairUsecase = container.get<GenerateKeyPairPort>(TYPES.GenerateKeyPair);
    
    await generateCryptoKeyPairUsecase.execute().catch((error: any) => console.log(error.message));

    const dependencyInjectionMiddleware = (req: any, res: any, next: any) => {
        req.container = container;
        next();
    };

    httpExpressAdapter
        .setMiddleware(dependencyInjectionMiddleware)
        .registerRouter('', httpHealthController.router())
        .registerRouter('/api/v1', httpEncryptController.router())
        .registerRouter('/api/v1', httpDecryptController.router())
        .runServer();
})();