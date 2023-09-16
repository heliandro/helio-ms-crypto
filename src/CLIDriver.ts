import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { log } from './shared/utils/log';

import CryptoKeyType from './domain/types/CryptoKeyType';

import GenerateKeyPairPort from './application/ports/GenerateKeyPairPort';
import GetKeyPort from './application/ports/GetKeyPort';
import EncryptPort from './application/ports/EncryptPort';
import DecryptPort from './application/ports/DecryptPort';

import CliContainerUI from './shared/presentation/CliContainerUI';

import DependencyInjection from './infrastructure/configuration/DependencyInjection';
import TYPES from './infrastructure/configuration/Types';

@injectable()
export default class CLIDriver {
    constructor(
        @inject(TYPES.CliContainerUI) readonly cliContainerUI: CliContainerUI,
        @inject(TYPES.GenerateKeyPair) readonly generateKeyPair: GenerateKeyPairPort,
        @inject(TYPES.GetKey) readonly getKey: GetKeyPort,
        @inject(TYPES.Encrypt) readonly encrypt: EncryptPort,
        @inject(TYPES.Decrypt) readonly decrypt: DecryptPort
    ) {}

    async start() {
        this.cliContainerUI.start();
        const isHeaderUI = false;
        await this.showMenu(isHeaderUI);
    }

    private async continueQuestion(): Promise<void> {
        const chosen = await this.cliContainerUI.continueAndChooseAnOption();

        if (chosen === 'n')
            return this.cliContainerUI.finish();

        await this.showMenu();
    }

    async showMenu(isHeaderUI: boolean = true): Promise<void> {
        const chosen = await this.cliContainerUI.showMenuAndChooseAnOption(isHeaderUI);
        const [chosenFirstArg, chosenSecondArg] = this.extractArguments(chosen);

        if (this.isInvalidOptions(chosenFirstArg, chosenSecondArg)) {
            log.error('\nOpção inválida.');
            return await this.continueQuestion();
        }

        switch (chosenFirstArg) {
            case 'generate':
                await this.choiceGenerateKeys();
                break;

            case 'get':
                const type = <CryptoKeyType>chosenSecondArg;
                await this.choiceGetKey(type);
                break;

            case 'encrypt':
                await this.choiceEncrypt(chosenSecondArg);
                break;

            case 'decrypt':
                await this.choiceDecrypt(chosenSecondArg);
                break;

            case 'close':
                this.cliContainerUI.finish();
                break;

            default:
                log.error('\nOpção inválida.');
                await this.continueQuestion();
        }
    }

    private extractArguments(chosen: string) {
        return /\s/.test(chosen) ? chosen.replace(' ', '--').split('--') : [chosen];
    }

    private isInvalidOptions(first: string, second: string): boolean {
        return !first || first !== 'generate' && first !== 'close' && !second;
    }

    private async choiceGenerateKeys() {
        return this.generateKeyPair
            .execute()
            .then(this.outputSuccess)
            .catch(this.outputError)
            .finally(() => {
                this.continueQuestion().then();
            });
    }

    private async choiceGetKey(type: CryptoKeyType) {
        return this.getKey
            .execute({ keyType: type })
            .then(this.outputSuccess)
            .catch(this.outputError)
            .finally(() => {
                this.continueQuestion().then();
            });
    }

    private async choiceEncrypt(data: any) {
        return this.encrypt
            .execute({ data })
            .then(this.outputSuccess)
            .catch(this.outputError)
            .finally(() => {
                this.continueQuestion().then();
            });
    }

    private async choiceDecrypt(data: string) {
        return this.decrypt
            .execute({ data })
            .then(this.outputSuccess)
            .catch(this.outputError)
            .finally(() => {
                this.continueQuestion().then();
            });
    }

    private outputSuccess(data: any) {
        log.info('\n' + JSON.stringify(data, null, 2));
    }

    private outputError(error: any) {
        log.error(`\n${error.message}`);
    }
}

export const initCLI = () => {
    const di = DependencyInjection.createCLI();
    const cli = di.get(CLIDriver);
    cli.start();
};