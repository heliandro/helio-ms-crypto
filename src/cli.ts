import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { log } from './shared/utils/log';

import CryptoKeyType from './domain/types/CryptoKeyType';

import GenerateKeyPairPort from './application/ports/GenerateKeyPairPort';
import GetKeyPort from './application/ports/GetKeyPort';
import EncryptPort from './application/ports/EncryptPort';
import DecryptPort from './application/ports/DecryptPort';
import TYPES from './infrastructure/configuration/Types';
import CliContainerUI from './shared/presentation/CliContainerUI';

@injectable()
export default class CLI {
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

    async continueQuestion(): Promise<void> {
        const chosen = await this.cliContainerUI.continueAndChooseAnOption();

        if (chosen === 'n') {
            this.cliContainerUI.finish();
            return;
        }

        await this.showMenu();
    }

    isInvalidArg(arg: string): boolean {
        if (!arg) {
            log.error('\nOpção inválida.');
            return true;
        }
        return false;
    }

    async showMenu(isHeaderUI: boolean = true): Promise<void> {
        const chosen = await this.cliContainerUI.showMenuAndChooseAnOption(isHeaderUI);

        const [chosenFirstArg, chosenSecondArg] = /\s/.test(chosen)
            ? chosen.replace(' ', '--').split('--')
            : [chosen];

        switch (chosenFirstArg) {
            case 'generate': {
                await this.choiceGenerateKeys();
                break;
            }

            case 'get': {
                if (this.isInvalidArg(chosenSecondArg)) {
                    await this.continueQuestion();
                    break;
                }
                const type = <CryptoKeyType>chosenSecondArg;
                await this.choiceGetKey(type);
                break;
            }

            case 'encrypt': {
                if (this.isInvalidArg(chosenSecondArg)) {
                    await this.continueQuestion();
                    break;
                }
                await this.choiceEncrypt(chosenSecondArg);
                break;
            }

            case 'decrypt': {
                if (this.isInvalidArg(chosenSecondArg)) {
                    await this.continueQuestion();
                    break;
                }
                await this.choiceDecrypt(chosenSecondArg);
                break;
            }

            case 'close': {
                this.cliContainerUI.finish();
                break;
            }

            default: {
                log.error('\nOpção inválida.');
                await this.continueQuestion();
                break;
            }
        }
    }

    async choiceGenerateKeys() {
        return this.generateKeyPair
            .execute()
            .then(this.outputSuccess)
            .catch(this.outputError)
            .finally(() => {
                this.continueQuestion().then();
            });
    }

    async choiceGetKey(type: CryptoKeyType) {
        return this.getKey
            .execute({ keyType: type })
            .then(this.outputSuccess)
            .catch(this.outputError)
            .finally(() => {
                this.continueQuestion().then();
            });
    }

    async choiceEncrypt(data: any) {
        return this.encrypt
            .execute({ data })
            .then(this.outputSuccess)
            .catch(this.outputError)
            .finally(() => {
                this.continueQuestion().then();
            });
    }

    async choiceDecrypt(data: string) {
        return this.decrypt
            .execute({ data })
            .then(this.outputSuccess)
            .catch(this.outputError)
            .finally(() => {
                this.continueQuestion().then();
            });
    }

    outputSuccess(data: any) {
        log.info('\n' + JSON.stringify(data, null, 2));
    }

    outputError(error: any) {
        log.error(`\n${error.message}`);
    }
}
