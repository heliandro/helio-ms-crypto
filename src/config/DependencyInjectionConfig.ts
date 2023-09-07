import { Container } from "inversify";
import { TYPES } from "./Types";

import GenerateKeyPair from "../application/usecases/GenerateKeyPair";
import GetKey from "@app/application/usecases/GetKey";
import Encrypt from "@app/application/usecases/Encrypt";
import Decrypt from "@app/application/usecases/Decrypt";
import CryptoRepository from "../domain/repositories/CryptoRepository";
import CryptoRepositoryFileSystem from "../infrastructure/cryptoRepository/CryptoRepositoryFileSystem";
import Readline from "node:readline";
import { CliContainerUI } from "@app/shared/presentation/CliContainerUI";
import { CLI } from "@app/cli";

const DIContainer = new Container();

// UseCases
DIContainer.bind<GenerateKeyPair>(GenerateKeyPair).to(GenerateKeyPair).inSingletonScope();
DIContainer.bind<GetKey>(GetKey).to(GetKey).inSingletonScope();
DIContainer.bind<Encrypt>(Encrypt).to(Encrypt).inSingletonScope();
DIContainer.bind<Decrypt>(Decrypt).to(Decrypt).inSingletonScope();
// Repositories
DIContainer.bind<CryptoRepository>(TYPES.CryptoRepositoryFileSystem).to(CryptoRepositoryFileSystem).inSingletonScope();
// Readline
const readline = Readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
DIContainer.bind<Readline.Interface>(Readline.Interface).toConstantValue(readline);
// UI
DIContainer.bind<CliContainerUI>(CliContainerUI).to(CliContainerUI).inSingletonScope();
// CLI
DIContainer.bind<CLI>(CLI).to(CLI).inSingletonScope();

export default DIContainer;