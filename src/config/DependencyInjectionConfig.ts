import Readline from "node:readline";
import { Container } from "inversify";
import TYPES from "./Types";

import GenerateKeyPair from "../application/usecases/GenerateKeyPair";
import GetKey from "@app/application/usecases/GetKey";
import Encrypt from "@app/application/usecases/Encrypt";
import Decrypt from "@app/application/usecases/Decrypt";
import CryptoRepository from "../domain/repositories/CryptoRepository";
import CryptoRepositoryFileSystem from "../infrastructure/cryptoRepository/CryptoRepositoryFileSystem";

import CliContainerUI from "@app/shared/presentation/CliContainerUI";
import CLI from "@app/cli";

const readline = Readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
readline.close();

export default class DependencyInjectionConfig {

    static create(): Container {
        const container = new Container();

        // UseCases
        container.bind<GenerateKeyPair>(GenerateKeyPair).to(GenerateKeyPair).inSingletonScope();
        container.bind<GetKey>(GetKey).to(GetKey).inSingletonScope();
        container.bind<Encrypt>(Encrypt).to(Encrypt).inSingletonScope();
        container.bind<Decrypt>(Decrypt).to(Decrypt).inSingletonScope();
        // Repositories
        container.bind<CryptoRepository>(TYPES.CryptoRepositoryFileSystem).to(CryptoRepositoryFileSystem).inSingletonScope();
        // Readline
        container.bind<Readline.Interface>(Readline.Interface).toConstantValue(readline);
        // UI
        container.bind<CliContainerUI>(CliContainerUI).to(CliContainerUI).inSingletonScope();
        // CLI
        container.bind<CLI>(CLI).to(CLI).inSingletonScope();

        return container;
    }
}