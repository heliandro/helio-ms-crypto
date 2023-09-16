import Readline from 'node:readline';
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
import CryptoRepositoryPort from '../../application/ports/repository/CryptoRepositoryPort';
import CryptoRepositoryFileSystem from '../adapters/repository/CryptoRepositoryFileSystem';

import CliContainerUI from '../../shared/presentation/CliContainerUI';
import CLIDriver from '../../CLIDriver';

const diBindCore = (container: Container) => {
    if (!container) throw new Error('DI iniciado incorretamente.');

    // Ports
    container.bind<GenerateKeyPairPort>(TYPES.GenerateKeyPair).to(GenerateKeyPair).inSingletonScope();
    container.bind<GetKeyPort>(TYPES.GetKey).to(GetKey).inSingletonScope();
    container.bind<EncryptPort>(TYPES.Encrypt).to(Encrypt).inSingletonScope();
    container.bind<DecryptPort>(TYPES.Decrypt).to(Decrypt).inSingletonScope();
    // Adapters
    container
        .bind<CryptoRepositoryPort>(TYPES.CryptoRepositoryFileSystem)
        .to(CryptoRepositoryFileSystem)
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

        const readline = Readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        container.bind<Readline.Interface>(Readline.Interface).toConstantValue(readline);
        container.bind<CliContainerUI>(TYPES.CliContainerUI).to(CliContainerUI).inSingletonScope();
        // CLI Driver
        container.bind<CLIDriver>(CLIDriver).to(CLIDriver).inSingletonScope();

        return container;
    }
}
