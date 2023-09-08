import Readline from "node:readline";
import { Container } from "inversify";
import TYPES from "./Types";

import GenerateKeyPair from "../application/usecases/GenerateKeyPair";
import GetKey from "../application/usecases/GetKey";
import Encrypt from "../application/usecases/Encrypt";
import Decrypt from "../application/usecases/Decrypt";
import CryptoRepository from "../domain/repositories/CryptoRepository";
import CryptoRepositoryFileSystem from "../infrastructure/cryptoRepository/CryptoRepositoryFileSystem";

import CliContainerUI from "../shared/presentation/CliContainerUI";
import CLI from "../cli";

const diBindCore = (container: Container) => {
    if (!container) throw new Error('DI iniciado incorretamente.');

    // UseCases
    container.bind<GenerateKeyPair>(GenerateKeyPair).to(GenerateKeyPair).inSingletonScope();
    container.bind<GetKey>(GetKey).to(GetKey).inSingletonScope();
    container.bind<Encrypt>(Encrypt).to(Encrypt).inSingletonScope();
    container.bind<Decrypt>(Decrypt).to(Decrypt).inSingletonScope();
    // Repositories
    container.bind<CryptoRepository>(TYPES.CryptoRepositoryFileSystem).to(CryptoRepositoryFileSystem).inSingletonScope();
}

export default class DependencyInjectionConfig {

    static create(): Container {
        const container = new Container();
        diBindCore(container);
        return container;
    }

    static createCLI(): Container {
        const container = new Container();
        diBindCore(container);
        // Readline
        const readline = Readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        container.bind<Readline.Interface>(Readline.Interface).toConstantValue(readline);
        // UI
        container.bind<CliContainerUI>(CliContainerUI).to(CliContainerUI).inSingletonScope();
        // CLI
        container.bind<CLI>(CLI).to(CLI).inSingletonScope();

        return container;
    }
}