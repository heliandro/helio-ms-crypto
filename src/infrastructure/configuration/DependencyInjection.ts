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
import CLI from '../../cli';

const diBindCore = (container: Container) => {
    if (!container) throw new Error('DI iniciado incorretamente.');

    // Ports
    container.bind<GenerateKeyPairPort>(GenerateKeyPair).to(GenerateKeyPair).inSingletonScope();
    container.bind<GetKeyPort>(GetKey).to(GetKey).inSingletonScope();
    container.bind<EncryptPort>(Encrypt).to(Encrypt).inSingletonScope();
    container.bind<DecryptPort>(Decrypt).to(Decrypt).inSingletonScope();
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
        container.bind<CliContainerUI>(CliContainerUI).to(CliContainerUI).inSingletonScope();
        // CLI Driver
        container.bind<CLI>(CLI).to(CLI).inSingletonScope();

        return container;
    }
}
