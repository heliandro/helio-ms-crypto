import GenerateKeys from "@app/application/usecase/GenerateKeyPair";
import GetKey from "@app/application/usecase/GetKey";
import CLI from "@app/cli";
import CryptoRepository from "@app/domain/repository/CryptoRepository";
import CryptoRepositoryFileSystem from "@app/infra/repository/CryptoRepositoryFileSystem";
import { CliContainerUI } from "@app/shared/presentation/CliContainerUI";
import Readline from "readline";
import sinon from 'sinon';
import { deleteFolder } from '../utils/FileSystemHelper';
import { MOCK_PRIVATE_KEY, MOCK_PUBLIC_KEY } from "@tests/utils/KeyPair.constants";
import FileSystem from 'node:fs';

const sleep = async (milisseconds: number) => new Promise((resolve) => setTimeout(resolve, milisseconds));

describe('CLI', () => {

    let readline: Readline.Interface;
    let consoleLogSpy: sinon.SinonSpy

    let repository: CryptoRepository;
    let readlineQuestionStub: sinon.SinonStub;
    let ui: CliContainerUI;
    let generateKeys: GenerateKeys;
    let getKey: GetKey;
    let cli: CLI;

    beforeEach(() => {
        consoleLogSpy = sinon.spy(console, 'log');
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

    describe('Cenários de Sucesso', () => {

        beforeEach(() => {
            deleteFolder('./keys');
        })

        test('Deve iniciar e encerrar', async () => {
            // Given
            const cliStartSpy = sinon.spy(cli, 'start');
            const cliStartShowMenuSpy = sinon.spy(cli, 'showMenu');
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'close');
            await cli.start();
            // Then
            expect(cliStartSpy.callCount).toBe(1);
            expect(cliStartShowMenuSpy.callCount).toBe(1);
        });

        test('Deve gerar as chaves de criptografia', async () => {
            // Given
            const cliStartSpy = sinon.spy(cli, 'start');
            const cliStartShowMenuSpy = sinon.spy(cli, 'showMenu');
            const uiFinishSpy = sinon.spy(ui, 'finish');
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'generate');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cli.start();
            // Then
            expect(cliStartSpy.callCount).toBe(1);
            expect(cliStartShowMenuSpy.callCount).toBe(1);
            expect(uiFinishSpy.callCount).toBe(1);
        });

        test('Deve voltar ao menu apos gerar as chaves de criptografia', async () => {
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

        test('Deve recuperar a chave publica', async () => {
            // Given
            sinon.stub(FileSystem, 'existsSync').returns(true)
            sinon.stub(FileSystem, 'readFileSync').returns(MOCK_PUBLIC_KEY)
            const cliStartSpy = sinon.spy(cli, 'start');
            const cliStartShowMenuSpy = sinon.spy(cli, 'showMenu');
            const uiFinishSpy = sinon.spy(ui, 'finish');
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'get public');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cli.start();
            // Then
            expect(cliStartSpy.callCount).toBe(1);
            expect(cliStartShowMenuSpy.callCount).toBe(1);
            expect(uiFinishSpy.callCount).toBe(1);
        });

        test('Deve recuperar a chave privada', async () => {
            // Given
            sinon.stub(FileSystem, 'existsSync').returns(true)
            sinon.stub(FileSystem, 'readFileSync').returns(MOCK_PRIVATE_KEY)
            const cliStartSpy = sinon.spy(cli, 'start');
            const cliStartShowMenuSpy = sinon.spy(cli, 'showMenu');
            const uiFinishSpy = sinon.spy(ui, 'finish');
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'get private');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cli.start();
            // Then
            expect(cliStartSpy.callCount).toBe(1);
            expect(cliStartShowMenuSpy.callCount).toBe(1);
            expect(uiFinishSpy.callCount).toBe(1);
        });

        test('Deve escolher uma opcao inválida', async () => {
            // Given
            const cliStartSpy = sinon.spy(cli, 'start');
            const cliStartShowMenuSpy = sinon.spy(cli, 'showMenu');
            const uiFinishSpy = sinon.spy(ui, 'finish');
            const errorMessage = 'Opção inválida.';
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'xpto');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cli.start();
            // Then
            expect(cliStartSpy.callCount).toBe(1);
            expect(cliStartShowMenuSpy.callCount).toBe(1);
            expect(uiFinishSpy.callCount).toBe(1);
            expect(consoleLogSpy.getCall(2).calledWithMatch(errorMessage)).toBe(true)
        });
    })

    describe('Cenários de Erro', () => {

        test('Deve logar uma mensagem de erro ao criar novas chaves', async () => {
            // Given
            sinon.stub(FileSystem, 'existsSync').returns(true)
            const cliStartSpy = sinon.spy(cli, 'start');
            const cliStartShowMenuSpy = sinon.spy(cli, 'showMenu');
            const uiFinishSpy = sinon.spy(ui, 'finish');
            const errorMessage = 'O par de chaves de criptografia já existe no caminho especificado.';
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'generate');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cli.start();
            // Then
            expect(cliStartSpy.callCount).toBe(1);
            expect(cliStartShowMenuSpy.callCount).toBe(1);
            expect(uiFinishSpy.callCount).toBe(1);
            expect(consoleLogSpy.getCall(2).calledWithMatch(errorMessage)).toBe(true)
        });

        test('Deve logar uma mensagem de erro ao realizar a operação de escrita em disco', async () => {
            // Given
            sinon.stub(FileSystem, 'existsSync').returns(false);
            sinon.stub(FileSystem, 'mkdirSync').throws(new Error('Erro de escrita'));
            const cliStartSpy = sinon.spy(cli, 'start');
            const cliStartShowMenuSpy = sinon.spy(cli, 'showMenu');
            const uiFinishSpy = sinon.spy(ui, 'finish');
            const errorMessage = 'Falha ao salvar o par de chaves de criptografia.';
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'generate');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cli.start();
            // Then
            expect(cliStartSpy.callCount).toBe(1);
            expect(cliStartShowMenuSpy.callCount).toBe(1);
            expect(uiFinishSpy.callCount).toBe(1);
            expect(consoleLogSpy.getCall(2).calledWithMatch(errorMessage)).toBe(true)
        });

        test('Deve logar uma mensagem de erro ao tentar recuperar uma chave inexistente', async () => {
            // Given
            const cliStartSpy = sinon.spy(cli, 'start');
            const cliStartShowMenuSpy = sinon.spy(cli, 'showMenu');
            const uiFinishSpy = sinon.spy(ui, 'finish');
            const errorMessage = 'A chave de criptografia não existe no caminho especificado.';
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'get public');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cli.start();
            // Then
            expect(cliStartSpy.callCount).toBe(1);
            expect(cliStartShowMenuSpy.callCount).toBe(1);
            expect(uiFinishSpy.callCount).toBe(1);
            expect(consoleLogSpy.getCall(2).calledWithMatch(errorMessage)).toBe(true)
        });

        test('Deve logar uma mensagem de erro ao efetuar a leitura em disco', async () => {
            // Given
            sinon.stub(FileSystem, 'existsSync').returns(true)
            sinon.stub(FileSystem, 'readFileSync').throws(new Error('Erro de leitura'));
            const cliStartSpy = sinon.spy(cli, 'start');
            const cliStartShowMenuSpy = sinon.spy(cli, 'showMenu');
            const uiFinishSpy = sinon.spy(ui, 'finish');
            const errorMessage = 'A chave de criptografia não pode ser recuperada devido a uma falha no serviço.';
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'get public');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cli.start();
            // Then
            expect(cliStartSpy.callCount).toBe(1);
            expect(cliStartShowMenuSpy.callCount).toBe(1);
            expect(uiFinishSpy.callCount).toBe(1);
            expect(consoleLogSpy.getCall(2).calledWithMatch(errorMessage)).toBe(true)
        });
    })
});