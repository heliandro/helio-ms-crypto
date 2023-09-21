import { Container } from 'inversify';
import TYPES from './Types';
import 'reflect-metadata';

import GenerateKeyPairPort from '../../application/ports/GenerateKeyPairPort';
import GetKeyPort from '../../application/ports/GetKeyPort';
import EncryptPort from '../../application/ports/EncryptPort';
import DecryptPort from '../../application/ports/DecryptPort';

import GenerateKeyPair from '../../application/usecases/GenerateKeyPair';
import GetKey from '../../application/usecases/GetKey';
import Encrypt from '../../application/usecases/Encrypt';
import Decrypt from '../../application/usecases/Decrypt';
import CryptoRepository from '../../application/ports/adapters/CryptoRepository';
import CryptoFileSystemRepository from '../repository/CryptoFileSystemRepository';

import CLIDriver from '../../CLIDriver';
import CLIAdapter from '../../application/ports/adapters/CLIAdapter';
import CLIReadlineAdapter from '../adapters/cli/CLIReadlineAdapter';
import FileSystemFSAdapter from '../adapters/system/FileSystemFSAdapter';
import FileSystemAdapter from '../../application/ports/adapters/FileSystemAdapter';

const diBindCore = (container: Container) => {
    if (!container) throw new Error('DI iniciado incorretamente.');

    // Ports
    container
        .bind<GenerateKeyPairPort>(TYPES.GenerateKeyPair)
        .to(GenerateKeyPair)
        .inSingletonScope();
    container.bind<GetKeyPort>(TYPES.GetKey).to(GetKey).inSingletonScope();
    container.bind<EncryptPort>(TYPES.Encrypt).to(Encrypt).inSingletonScope();
    container.bind<DecryptPort>(TYPES.Decrypt).to(Decrypt).inSingletonScope();
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
}
