import Readline from 'readline';
import GenerateKeyPair from '@app/application/usecase/GenerateKeyPair'; // Importe seu use case de geração de chave
import GetKey from '@app/application/usecase/GetKey'; // Importe seu use case de leitura de chave
import CryptoRepositoryFileSystem from '@app/infra/repository/CryptoRepositoryFileSystem'; // Importe seu repositório
import { CliContainerUI } from './shared/presentation/CliContainerUI';
import { log } from './shared/utils/function/log';

class CLI {

    constructor(
        readonly cliContainerUI: CliContainerUI,
        readonly generateKeyPair: GenerateKeyPair,
        readonly getKey: GetKey
    ) {

    }

    async start() {
        this.cliContainerUI.start();
        const isHeaderUI = false;
        this.showMenu(isHeaderUI);
    }

    async continueQuestion(): Promise<void> {
        const chosen = await this.cliContainerUI.continueAndChooseAnOption()
    
        if (chosen === 'n') {
            this.cliContainerUI.finish();
            return;
        }

        await this.showMenu()
    }

    async showMenu(isHeaderUI: boolean = true): Promise<void> {
        const chosen = await this.cliContainerUI.showMenuAndChooseAnOption(isHeaderUI)

        switch(chosen) {
            case 'generate': {
                this.choiceGenerateKeys();
                break;
            }
    
            case 'get public':
            case 'get private': {
                const type = <KeyType>chosen.replace('get ', '');
                this.choiceGetKey(type);
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

    choiceGenerateKeys() {
        this.generateKeyPair.execute()
            .then(this.outputSuccess)
            .catch(this.outputError)
            .finally(() => { this.continueQuestion().then() })
    }

    choiceGetKey(type: KeyType) {
        this.getKey.execute({ keyType: type })
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

(async function main() {
    const readline = Readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    
    const ui = new CliContainerUI(readline)
    const repository = new CryptoRepositoryFileSystem();
    const generateKeyPair = new GenerateKeyPair(repository);
    const getKey = new GetKey(repository);

    const cli = new CLI(ui, generateKeyPair, getKey);

    cli.start();
})();