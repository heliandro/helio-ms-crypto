import Readline from 'readline';
import GenerateKeyPair from '@app/application/usecases/GenerateKeyPair';
import GetKey from '@app/application/usecases/GetKey';
import CryptoRepositoryFileSystem from '@app/infrastructure/cryptoRepository/CryptoRepositoryFileSystem';
import { CliContainerUI } from './shared/presentation/CliContainerUI';
import { log } from './shared/utils/log';
import Encrypt from './application/usecases/Encrypt';
import Decrypt from './application/usecases/Decrypt';
import { CryptoKeyType } from './domain/types/CryptoKeyType';

export class CLI {

    constructor(
        readonly cliContainerUI: CliContainerUI,
        readonly generateKeyPair: GenerateKeyPair,
        readonly getKey: GetKey,
        readonly encrypt: Encrypt,
        readonly decrypt: Decrypt
    ) {}

    async start() {
        this.cliContainerUI.start();
        const isHeaderUI = false;
        await this.showMenu(isHeaderUI);
    }

    async continueQuestion(): Promise<void> {
        const chosen = await this.cliContainerUI.continueAndChooseAnOption()
    
        if (chosen === 'n') {
            this.cliContainerUI.finish();
            return;
        }

        await this.showMenu()
    }

    isInvalidArg(arg: string): boolean {
        if (!arg) {
            log.error('\nOpção inválida.');
            return true;
        }
        return false;
    }

    async showMenu(isHeaderUI: boolean = true): Promise<void> {
        const chosen = await this.cliContainerUI.showMenuAndChooseAnOption(isHeaderUI)
        
        const [chosenFirstArg, chosenSecondArg] = /\s/.test(chosen) ? chosen.replace(' ', '--').split('--') : [chosen];

        switch(chosenFirstArg) {
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
        return this.generateKeyPair.execute()
            .then(this.outputSuccess)
            .catch(this.outputError)
            .finally(() => { this.continueQuestion().then() })
    }

    async choiceGetKey(type: CryptoKeyType) {
        return this.getKey.execute({ keyType: type })
            .then(this.outputSuccess)
            .catch(this.outputError)
            .finally(() => { this.continueQuestion().then() })
    }

    async choiceEncrypt(data: any) {
        return this.encrypt.execute({data})
            .then(this.outputSuccess)
            .catch(this.outputError)
            .finally(() => { this.continueQuestion().then() })
    }

    async choiceDecrypt(data: string) {
        return this.decrypt.execute({data})
            .then(this.outputSuccess)
            .catch(this.outputError)
            .finally(() => { this.continueQuestion().then() })
    }

    outputSuccess(data: any) {
        log.info('\n' + JSON.stringify(data, null, 2));
    }

    outputError(error: any) {
        log.error(`\n${error.message}`);
    }
}

export async function init() {
    const readline = Readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    
    const ui = new CliContainerUI(readline)
    const repository = new CryptoRepositoryFileSystem();
    const generateKeyPair = new GenerateKeyPair(repository);
    const getKey = new GetKey(repository);
    const encrypt = new Encrypt(repository);
    const decrypt = new Decrypt(repository);

    const cli = new CLI(ui, generateKeyPair, getKey, encrypt, decrypt);

    return {
        dependency: { readline, ui },
        instance: { cli }
    }
};