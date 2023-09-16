import { Container } from 'inversify';
import FileSystem from 'node:fs';
import Readline from 'readline';
import sinon from 'sinon';

import DependencyInjection from '../../src/infrastructure/configuration/DependencyInjection';

import CLI from '../../src/cli';
import CliContainerUI from '../../src/shared/presentation/CliContainerUI';

import { deleteFolder } from '../shared/utils/FileSystemHelper';
import { MOCK_PRIVATE_KEY, MOCK_PUBLIC_KEY } from '../shared/types/KeyPair.constants';

describe('CLI', () => {
    let readlineQuestionStub: sinon.SinonStub;
    let consoleLogSpy: sinon.SinonSpy;

    let container: Container;
    let readline: Readline.Interface;
    let ui: CliContainerUI;
    let cli: CLI;

    beforeEach(() => {
        container = DependencyInjection.createCLI();
        readline = container.get<Readline.Interface>(Readline.Interface);
        ui = container.get<CliContainerUI>(CliContainerUI);
        cli = container.get<CLI>(CLI);

        consoleLogSpy = sinon.spy(console, 'log');
        // sinon.stub(console, 'error').returns()
        readlineQuestionStub = sinon.stub();
        sinon.replace(readline, 'question', readlineQuestionStub);
    });

    afterEach(() => {
        container.unbindAll();
        sinon.restore();
    });

    describe('Cenários de Sucesso', () => {
        beforeEach(() => {
            deleteFolder('./keys');
        });

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
            sinon.stub(FileSystem, 'existsSync').returns(true);
            sinon.stub(FileSystem, 'readFileSync').returns(MOCK_PUBLIC_KEY);
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
            sinon.stub(FileSystem, 'existsSync').returns(true);
            sinon.stub(FileSystem, 'readFileSync').returns(MOCK_PRIVATE_KEY);
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

        test('Deve encriptar um dado', async () => {
            // Given
            sinon.stub(FileSystem, 'existsSync').returns(true);
            sinon.stub(FileSystem, 'readFileSync').returns(MOCK_PUBLIC_KEY);
            const data = JSON.stringify({ nome: 'heliandro' });
            const cliStartSpy = sinon.spy(cli, 'start');
            const cliStartShowMenuSpy = sinon.spy(cli, 'showMenu');
            const uiFinishSpy = sinon.spy(ui, 'finish');
            const message = '"data": ';
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, `encrypt ${data}`);
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cli.start();
            // Then
            expect(cliStartSpy.callCount).toBe(1);
            expect(cliStartShowMenuSpy.callCount).toBe(1);
            expect(uiFinishSpy.callCount).toBe(1);
            expect(consoleLogSpy.getCall(2).calledWithMatch(message)).toBe(true);
        });

        test('Deve desencriptar um dado', async () => {
            // Given
            sinon.stub(FileSystem, 'existsSync').returns(true);
            sinon.stub(FileSystem, 'readFileSync').returns(MOCK_PRIVATE_KEY);
            const data =
                'ZDnjmkjlZGv4O7p/vRW3yCoEphgLQLLZTS9PMrfEFWnc2Hp7jOvujnmlEpWtZmuEXmRJnPvRlYlXoDUKVO+QxPxOT0k1z1W0HJTIbpD5WYbEt3ONgkpmwVk4Y1ZFYn9sNdQf5DQMuStkFLlMhsBS5zw0qq4JQ0l8nYygD3N8yVc=';
            const cliStartSpy = sinon.spy(cli, 'start');
            const cliStartShowMenuSpy = sinon.spy(cli, 'showMenu');
            const uiFinishSpy = sinon.spy(ui, 'finish');
            const message = '"data": ';
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, `decrypt ${data}`);
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cli.start();
            // Then
            expect(cliStartSpy.callCount).toBe(1);
            expect(cliStartShowMenuSpy.callCount).toBe(1);
            expect(uiFinishSpy.callCount).toBe(1);
            expect(consoleLogSpy.getCall(2).calledWithMatch(message)).toBe(true);
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
            expect(consoleLogSpy.getCall(2).calledWithMatch(errorMessage)).toBe(true);
        });
    });

    describe('Cenários de Erro', () => {
        test('Deve logar uma mensagem de erro ao escolher a opcao get sem o segundo argumento', async () => {
            // Given
            const cliStartSpy = sinon.spy(cli, 'start');
            const cliStartShowMenuSpy = sinon.spy(cli, 'showMenu');
            const uiFinishSpy = sinon.spy(ui, 'finish');
            const errorMessage = 'Opção inválida.';
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'get');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cli.start();
            // Then
            expect(cliStartSpy.callCount).toBe(1);
            expect(cliStartShowMenuSpy.callCount).toBe(1);
            expect(uiFinishSpy.callCount).toBe(1);
            expect(consoleLogSpy.getCall(2).calledWithMatch(errorMessage)).toBe(true);
        });

        test('Deve logar uma mensagem de erro ao criar novas chaves', async () => {
            // Given
            sinon.stub(FileSystem, 'existsSync').returns(true);
            const cliStartSpy = sinon.spy(cli, 'start');
            const cliStartShowMenuSpy = sinon.spy(cli, 'showMenu');
            const uiFinishSpy = sinon.spy(ui, 'finish');
            const errorMessage =
                'O par de chaves de criptografia já existe no caminho especificado.';
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'generate');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cli.start();
            // Then
            expect(cliStartSpy.callCount).toBe(1);
            expect(cliStartShowMenuSpy.callCount).toBe(1);
            expect(uiFinishSpy.callCount).toBe(1);
            expect(consoleLogSpy.getCall(2).calledWithMatch(errorMessage)).toBe(true);
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
            expect(consoleLogSpy.getCall(2).calledWithMatch(errorMessage)).toBe(true);
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
            expect(consoleLogSpy.getCall(2).calledWithMatch(errorMessage)).toBe(true);
        });

        test('Deve logar uma mensagem de erro ao efetuar a leitura em disco', async () => {
            // Given
            sinon.stub(FileSystem, 'existsSync').returns(true);
            sinon.stub(FileSystem, 'readFileSync').throws(new Error('Erro de leitura'));
            const cliStartSpy = sinon.spy(cli, 'start');
            const cliStartShowMenuSpy = sinon.spy(cli, 'showMenu');
            const uiFinishSpy = sinon.spy(ui, 'finish');
            const errorMessage =
                'A chave de criptografia não pode ser recuperada devido a uma falha no serviço.';
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'get public');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cli.start();
            // Then
            expect(cliStartSpy.callCount).toBe(1);
            expect(cliStartShowMenuSpy.callCount).toBe(1);
            expect(uiFinishSpy.callCount).toBe(1);
            expect(consoleLogSpy.getCall(2).calledWithMatch(errorMessage)).toBe(true);
        });
    });
});
