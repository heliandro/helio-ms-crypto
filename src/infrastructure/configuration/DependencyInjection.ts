import { Container } from 'inversify';
import TYPES from './Types';
import 'reflect-metadata';

import GenerateKeyPair from '../../application/usecases/interfaces/GenerateKeyPair';
import GetKey from '../../application/usecases/interfaces/GetKey';
import Encrypt from '../../application/usecases/interfaces/Encrypt';
import Decrypt from '../../application/usecases/interfaces/Decrypt';

import GenerateKeyPairUsecase from '../../application/usecases/GenerateKeyPairUsecase';
import GetKeyUsecase from '../../application/usecases/GetKeyUsecase';
import EncryptUsecase from '../../application/usecases/EncryptUsecase';
import DecryptUsecase from '../../application/usecases/DecryptUsecase';
import CryptoRepository from '../../application/ports/outbound/CryptoRepository';
import CryptoFileSystemRepository from '../repository/CryptoFileSystemRepository';

import CLIDriver from '../../CLIDriver';
import CLIAdapter from '../../application/ports/inbound/CLIAdapter';
import CLIReadlineAdapter from '../adapters/cli/CLIReadlineAdapter';
import FileSystemFSAdapter from '../adapters/system/FileSystemFSAdapter';
import FileSystemAdapter from '../../application/ports/outbound/FileSystemAdapter';
import HttpAdapter from '../../application/ports/inbound/HttpAdapter';
import HttpExpressAdapter from '../adapters/http/HttpExpressAdapter';
import HttpEncryptController from '../controllers/HttpEncryptController';
import HttpDecryptController from '../controllers/HttpDecryptController';
import HttpHealthController from '../controllers/HttpHealthController';
import HttpExpressRouterAdapter from '../adapters/http/HttpExpressRouterAdapter';
import HttpRouterAdapter from '@app/src/application/ports/inbound/HttpRouterAdapter';

const diBindCore = (container: Container) => {
    if (!container) throw new Error('DI iniciado incorretamente.');

    // Ports
    container
        .bind<GenerateKeyPair>(TYPES.GenerateKeyPairUsecase)
        .to(GenerateKeyPairUsecase)
        .inSingletonScope();
    container.bind<GetKey>(TYPES.GetKeyUsecase).to(GetKeyUsecase).inSingletonScope();
    container.bind<Encrypt>(TYPES.EncryptUsecase).to(EncryptUsecase).inSingletonScope();
    container.bind<Decrypt>(TYPES.DecryptUsecase).to(DecryptUsecase).inSingletonScope();
    // Adapters
    container
        .bind<FileSystemAdapter>(TYPES.FileSystemAdapter)
        .to(FileSystemFSAdapter)
        .inSingletonScope();
    container
        .bind<CryptoRepository>(TYPES.CryptoFileSystemRepository)
        .to(CryptoFileSystemRepository)
        .inSingletonScope();
};

export default class DependencyInjection {
    static create(): Container {
        const container = new Container();
        diBindCore(container);

        return container;
    }

    static createCLI(): Container {
        const container = new Container();
        diBindCore(container);

        container.bind<CLIAdapter>(TYPES.CLIAdapter).to(CLIReadlineAdapter).inSingletonScope();
        container.bind<CLIDriver>(CLIDriver).to(CLIDriver).inSingletonScope();

        return container;
    }

    static createHttp(): Container {
        const container = new Container();
        diBindCore(container);

        container
            .bind<HttpAdapter>(TYPES.HttpExpressAdapter)
            .to(HttpExpressAdapter)
            .inSingletonScope();
        container
            .bind<HttpRouterAdapter>(TYPES.HttpExpressRouterAdapter)
            .to(HttpExpressRouterAdapter)
            .inSingletonScope();

        container
            .bind<HttpHealthController>(TYPES.HttpHealthController)
            .to(HttpHealthController)
            .inSingletonScope();
        container
            .bind<HttpEncryptController>(TYPES.HttpEncryptController)
            .to(HttpEncryptController)
            .inSingletonScope();
        container
            .bind<HttpDecryptController>(TYPES.HttpDecryptController)
            .to(HttpDecryptController)
            .inSingletonScope();

        return container;
    }
}
