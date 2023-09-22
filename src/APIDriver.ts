import { Container } from 'inversify';
import DependencyInjection from './infrastructure/configuration/DependencyInjection';

import HttpEncryptController from './infrastructure/controllers/HttpEncryptController';
import TYPES from './infrastructure/configuration/Types';
import GenerateKeyPair from './application/usecases/interfaces/GenerateKeyPair';
import HttpAdapter from './application/ports/inbound/HttpAdapter';

(async () => {
    const container: Container = DependencyInjection.createHttp();

    const httpExpressAdapter = container.get<HttpAdapter>(TYPES.HttpExpressAdapter);
    const httpEncryptController = container.get<HttpEncryptController>(TYPES.HttpEncryptController);
    const httpDecryptController = container.get<HttpEncryptController>(TYPES.HttpDecryptController);
    const httpHealthController = container.get<HttpEncryptController>(TYPES.HttpHealthController);
    const generateCryptoKeyPairUsecase = container.get<GenerateKeyPair>(
        TYPES.GenerateKeyPairUsecase
    );

    await generateCryptoKeyPairUsecase.execute().catch((error: any) => console.log(error.message));

    httpExpressAdapter
        .registerRouter('', httpHealthController.router())
        .registerRouter('/api/v1', httpEncryptController.router())
        .registerRouter('/api/v1', httpDecryptController.router())
        .runServer();
})();
