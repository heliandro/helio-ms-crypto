import GenerateKeys from "@app/application/usecase/GenerateKeyPair";
import GetKey from "@app/application/usecase/GetKey";
import CLI from "@app/cli";
import CryptoRepository from "@app/domain/repository/CryptoRepository";
import CryptoRepositoryFileSystem from "@app/infra/repository/CryptoRepositoryFileSystem";
import { CliContainerUI } from "@app/shared/presentation/CliContainerUI";
import Readline from "readline";
import sinon from 'sinon';

const sleep = async (milisseconds: number) => new Promise((resolve) => setTimeout(resolve, milisseconds));

describe('CLI', () => {

    let repository: CryptoRepository;
    let readline: Readline.Interface;
    let readlineQuestionStub: sinon.SinonStub;
    let ui: CliContainerUI;
    let generateKeys: GenerateKeys;
    let getKey: GetKey;
    let cli: CLI;

    beforeEach(() => {
        readline = Readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        // init stubs
        readlineQuestionStub = sinon.stub();
        sinon.replace(readline, 'question', readlineQuestionStub);
        // init dependencies
        repository = new CryptoRepositoryFileSystem();
        ui = new CliContainerUI(readline);
        generateKeys = new GenerateKeys(repository);
        getKey = new GetKey(repository);
        // init cli
        cli = new CLI(ui, generateKeys, getKey);
    })

    afterEach(() => {
        sinon.restore();
    })

    describe('UI', () => {

        test('Deve iniciar o CLI', async () => {
            // Given
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'generate');
            const cliStartSpy = sinon.spy(cli, 'start');
            const cliStartShowMenuSpy = sinon.spy(cli, 'showMenu');
            // When
            await cli.start();
            // Then
            expect(cliStartSpy.callCount).toBe(1);
            expect(cliStartShowMenuSpy.callCount).toBe(1);
        });

        test('Deve iniciar, escolher uma opcao e continuar', async () => {
            // Given
            const cliStartSpy = sinon.spy(cli, 'start');
            const cliStartShowMenuSpy = sinon.spy(cli, 'showMenu');
            const uiFinishSpy = sinon.spy(ui, 'finish');
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'generate');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 's');
            readlineQuestionStub.onThirdCall().callsArgWith(1, 'close');
            await cli.start();
            // Then
            expect(cliStartSpy.callCount).toBe(1);
            expect(cliStartShowMenuSpy.callCount).toBe(2);
            expect(uiFinishSpy.callCount).toBe(1);
        });
    })
});