import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { log } from './shared/utils/log';

import CryptoKeyType from './domain/types/CryptoKeyType';

import GenerateKeyPairPort from './application/ports/GenerateKeyPairPort';
import GetKeyPort from './application/ports/GetKeyPort';
import EncryptPort from './application/ports/EncryptPort';
import DecryptPort from './application/ports/DecryptPort';

import DependencyInjection from './infrastructure/configuration/DependencyInjection';
import TYPES from './infrastructure/configuration/Types';
import CLIAdapter from './application/ports/adapters/CLIAdapter';
import { HeaderComponentUI } from './presentation/HeaderComponentUI';
import { MenuComponentUI } from './presentation/MenuComponentUI';
import { LogColor } from './shared/enum/LogColor.enum';

@injectable()
export default class CLIDriver {
    constructor(
        @inject(TYPES.CLIAdapter) readonly cliAdapter: CLIAdapter,
        @inject(TYPES.GenerateKeyPair) readonly generateKeyPair: GenerateKeyPairPort,
        @inject(TYPES.GetKey) readonly getKey: GetKeyPort,
        @inject(TYPES.Encrypt) readonly encrypt: EncryptPort,
        @inject(TYPES.Decrypt) readonly decrypt: DecryptPort
    ) {}

    async start() {
        HeaderComponentUI();
        await this.showMenuAndAskAQuestion();
    }

    async showMenuAndAskAQuestion(): Promise<void> {
        MenuComponentUI();
        const chosen = await this.cliAdapter.executeQuestion();
        const [option, argument] = this.extractOptionAndArgument(chosen);

        try {
            this.validateChosen(option, argument);
            await this.chosenStrategy()[option](argument);
        } catch (error: any) {
            log.error(`\n${error.message}`);
            await this.askAContinueQuestion();
        }
    }

    private extractOptionAndArgument(chosen: string): string[] {
        return /\s/.test(chosen) ? chosen.replace(' ', '--').split('--') : [chosen];
    }

    private validateChosen(first: string, second: string): void {
        const isInvalid = !first || (first !== 'generate' && first !== 'close' && !second);
        if (isInvalid) throw new Error('Opção inválida.');
    }

    private chosenStrategy(): { [key: string]: Function } {
        return {
            generate: async () => await this.getUsecase(this.generateKeyPair),
            get: async (data: string) => await this.getUsecase(this.getKey, <CryptoKeyType>data),
            encrypt: async (data: string) => await this.getUsecase(this.encrypt, { data }),
            decrypt: async (data: string) => await this.getUsecase(this.decrypt, { data }),
            close: () => this.finishCLI()
        };
    }

    private async getUsecase(usecase: { execute: Function }, data?: any) {
        return usecase
            .execute(data)
            .then(this.outputSuccess)
            .catch(this.outputError)
            .finally(() => {
                this.askAContinueQuestion().then();
            });
    }

    private outputSuccess(data: any) {
        log.info('\n' + JSON.stringify(data, null, 2));
    }

    private outputError(error: any) {
        log.error(`\n${error.message}`);
    }

    private async askAContinueQuestion(): Promise<void> {
        const chosen = await this.cliAdapter.executeQuestion(
            '\nDeseja continuar? digite: "s" ou "n"\n'
        );
        if (chosen === 'n') return this.finishCLI();
        await this.showMenuAndAskAQuestion();
    }

    private finishCLI(): void {
        const message = 'Encerrando o CLI. Até a proxima!';
        console.log(`\n${LogColor.MAGENTA}${message}${LogColor.RESET}\n`);
        this.cliAdapter.finish();
    }
}

export const initCLI = () => {
    const di = DependencyInjection.createCLI();
    const cli = di.get(CLIDriver);
    cli.start();
};
