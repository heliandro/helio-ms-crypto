import { Container, inject, injectable } from 'inversify';
import DependencyInjection from './infrastructure/configuration/DependencyInjection';

import HttpEncryptController from './infrastructure/controllers/HttpEncryptController';
import TYPES from './infrastructure/configuration/Types';
import GenerateKeyPair from './application/usecases/interfaces/GenerateKeyPair';
import HttpAdapter from './application/ports/inbound/HttpAdapter';

@injectable()
export default class APIDriver {
    constructor(
        @inject(TYPES.HttpExpressAdapter) readonly httpAdapter: HttpAdapter,
        @inject(TYPES.GenerateKeyPairUsecase) readonly generateKeyPair: GenerateKeyPair,
        @inject(TYPES.HttpEncryptController) readonly httpEncryptController: HttpEncryptController,
        @inject(TYPES.HttpDecryptController) readonly httpDecryptController: HttpEncryptController,
        @inject(TYPES.HttpHealthController) readonly httpHealthController: HttpEncryptController
    ) {
        this.generateKeyPair.execute().catch((error: any) => console.log(error.message));
    }

    async start() {
        this.httpAdapter
            .registerRouter('', this.httpHealthController.router())
            .registerRouter('/api/v1', this.httpEncryptController.router())
            .registerRouter('/api/v1', this.httpDecryptController.router())
            .runServer();
    }
}

export const initAPIDriver = (): Container => {
    const container = DependencyInjection.createHttp();
    const apiDriver = container.get<APIDriver>(APIDriver);
    apiDriver.start();
    return container;
}
