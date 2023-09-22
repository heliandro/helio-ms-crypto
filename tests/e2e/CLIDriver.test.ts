import { Container } from 'inversify';
import readline from 'readline';
import sinon from 'sinon';

import { deleteFolder } from '../shared/utils/FileSystemHelper';
import { MOCK_PRIVATE_KEY, MOCK_PUBLIC_KEY } from '../shared/types/KeyPair.constants';

import DependencyInjection from '../../src/infrastructure/configuration/DependencyInjection';
import TYPES from '../../src/infrastructure/configuration/Types';
import CLIAdapter from '../../src/application/ports/inbound/CLIAdapter';
import CLIDriver from '../../src/CLIDriver';
import fsPromisesStub from '../shared/stubs/fsPromisesStub';
import Encrypt from '../../src/application/usecases/interfaces/Encrypt';
import Decrypt from '../../src/application/usecases/interfaces/Decrypt';

describe('CLIDriver', () => {
    let readlineQuestionStub: sinon.SinonStub;
    let consoleLogSpy: sinon.SinonSpy;

    let container: Container;
    let readline: readline.Interface;
    let cliAdapter: CLIAdapter;
    let cliDriver: CLIDriver;
    let encrypt: Encrypt;
    let decrypt: Decrypt;

    beforeEach(() => {
        container = DependencyInjection.createCLI();
        cliAdapter = container.get<CLIAdapter>(TYPES.CLIAdapter);
        readline = <readline.Interface>cliAdapter.getReadline();
        cliDriver = container.get<CLIDriver>(CLIDriver);
        encrypt = container.get<Encrypt>(TYPES.EncryptUsecase);
        decrypt = container.get<Decrypt>(TYPES.DecryptUsecase);
        // stubs
        consoleLogSpy = sinon.spy(console, 'log');
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
            const cliDriverStartSpy = sinon.spy(cliDriver, 'start');
            const cliDriverShowMenuSpy = sinon.spy(cliDriver, 'showMenuAndAskAQuestion');
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'close');
            await cliDriver.start();
            // Then
            expect(cliDriverStartSpy.callCount).toBe(1);
            expect(cliDriverShowMenuSpy.callCount).toBe(1);
        });

        test('Deve gerar as chaves de criptografia', async () => {
            // Given
            const cliDriverStartSpy = sinon.spy(cliDriver, 'start');
            const cliDriverShowMenuSpy = sinon.spy(cliDriver, 'showMenuAndAskAQuestion');
            const cliAdapterFinishSpy = sinon.spy(cliAdapter, 'finish');
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'generate');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cliDriver.start();
            // Then
            expect(cliDriverStartSpy.callCount).toBe(1);
            expect(cliDriverShowMenuSpy.callCount).toBe(1);
            expect(cliAdapterFinishSpy.callCount).toBe(1);
        });

        test('Deve voltar ao menu apos gerar as chaves de criptografia', async () => {
            // Given
            const cliDriverStartSpy = sinon.spy(cliDriver, 'start');
            const cliDriverShowMenuSpy = sinon.spy(cliDriver, 'showMenuAndAskAQuestion');
            const cliAdapterFinishSpy = sinon.spy(cliAdapter, 'finish');
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'generate');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 's');
            readlineQuestionStub.onThirdCall().callsArgWith(1, 'close');
            await cliDriver.start();
            // Then
            expect(cliDriverStartSpy.callCount).toBe(1);
            expect(cliDriverShowMenuSpy.callCount).toBe(2);
            expect(cliAdapterFinishSpy.callCount).toBe(1);
        });

        test('Deve recuperar a chave publica', async () => {
            // Given
            fsPromisesStub.stat({ isDirectory: true, isFile: true });
            fsPromisesStub.readFile(MOCK_PUBLIC_KEY);
            const cliDriverStartSpy = sinon.spy(cliDriver, 'start');
            const cliDriverShowMenuSpy = sinon.spy(cliDriver, 'showMenuAndAskAQuestion');
            const cliAdapterFinishSpy = sinon.spy(cliAdapter, 'finish');
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'get public');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cliDriver.start();
            // Then
            expect(cliDriverStartSpy.callCount).toBe(1);
            expect(cliDriverShowMenuSpy.callCount).toBe(1);
            expect(cliAdapterFinishSpy.callCount).toBe(1);
        });

        test('Deve recuperar a chave privada', async () => {
            // Given
            fsPromisesStub.stat({ isDirectory: true, isFile: true });
            fsPromisesStub.readFile(MOCK_PRIVATE_KEY);
            const cliDriverStartSpy = sinon.spy(cliDriver, 'start');
            const cliDriverShowMenuSpy = sinon.spy(cliDriver, 'showMenuAndAskAQuestion');
            const cliAdapterFinishSpy = sinon.spy(cliAdapter, 'finish');
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'get private');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cliDriver.start();
            // Then
            expect(cliDriverStartSpy.callCount).toBe(1);
            expect(cliDriverShowMenuSpy.callCount).toBe(1);
            expect(cliAdapterFinishSpy.callCount).toBe(1);
        });

        test('Deve encriptar um dado', async () => {
            // Given
            fsPromisesStub.stat({ isDirectory: true, isFile: true });
            fsPromisesStub.readFile(MOCK_PUBLIC_KEY);
            const data = JSON.stringify({ nome: 'heliandro' });
            const cliDriverStartSpy = sinon.spy(cliDriver, 'start');
            const cliDriverShowMenuSpy = sinon.spy(cliDriver, 'showMenuAndAskAQuestion');
            const cliAdapterFinishSpy = sinon.spy(cliAdapter, 'finish');
            const encryptSpy = sinon.spy(encrypt, 'execute');
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, `encrypt ${data}`);
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cliDriver.start();
            // Then
            expect(cliDriverStartSpy.callCount).toBe(1);
            expect(cliDriverShowMenuSpy.callCount).toBe(1);
            expect(cliAdapterFinishSpy.callCount).toBe(1);
            expect(await encryptSpy.returnValues[0]).toMatchObject({
                data: expect.any(String)
            });
        });

        test('Deve desencriptar um dado', async () => {
            // Given
            fsPromisesStub.stat({ isDirectory: true, isFile: true });
            fsPromisesStub.readFile(MOCK_PRIVATE_KEY);
            const data =
                'ZDnjmkjlZGv4O7p/vRW3yCoEphgLQLLZTS9PMrfEFWnc2Hp7jOvujnmlEpWtZmuEXmRJnPvRlYlXoDUKVO+QxPxOT0k1z1W0HJTIbpD5WYbEt3ONgkpmwVk4Y1ZFYn9sNdQf5DQMuStkFLlMhsBS5zw0qq4JQ0l8nYygD3N8yVc=';
            const cliDriverStartSpy = sinon.spy(cliDriver, 'start');
            const cliDriverShowMenuSpy = sinon.spy(cliDriver, 'showMenuAndAskAQuestion');
            const cliAdapterFinishSpy = sinon.spy(cliAdapter, 'finish');
            const decryptSpy = sinon.spy(decrypt, 'execute');
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, `decrypt ${data}`);
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cliDriver.start();
            // Then
            expect(cliDriverStartSpy.callCount).toBe(1);
            expect(cliDriverShowMenuSpy.callCount).toBe(1);
            expect(cliAdapterFinishSpy.callCount).toBe(1);
            expect(await decryptSpy.returnValues[0]).toMatchObject({
                data: expect.any(Object || String)
            });
        });

        test('Deve escolher uma opcao inválida', async () => {
            // Given
            const cliDriverStartSpy = sinon.spy(cliDriver, 'start');
            const cliDriverShowMenuSpy = sinon.spy(cliDriver, 'showMenuAndAskAQuestion');
            const cliAdapterFinishSpy = sinon.spy(cliAdapter, 'finish');
            const errorMessage = 'Opção inválida.';
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'xpto');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cliDriver.start();
            // Then
            expect(cliDriverStartSpy.callCount).toBe(1);
            expect(cliDriverShowMenuSpy.callCount).toBe(1);
            expect(cliAdapterFinishSpy.callCount).toBe(1);
            expect(consoleLogSpy.getCall(2).calledWithMatch(errorMessage)).toBe(true);
        });
    });

    describe('Cenários de Erro', () => {
        test('Deve logar uma mensagem de erro ao escolher a opcao get sem o segundo argumento', async () => {
            // Given
            const cliDriverStartSpy = sinon.spy(cliDriver, 'start');
            const cliDriverShowMenuSpy = sinon.spy(cliDriver, 'showMenuAndAskAQuestion');
            const cliAdapterFinishSpy = sinon.spy(cliAdapter, 'finish');
            const errorMessage = 'Opção inválida.';
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'get');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cliDriver.start();
            // Then
            expect(cliDriverStartSpy.callCount).toBe(1);
            expect(cliDriverShowMenuSpy.callCount).toBe(1);
            expect(cliAdapterFinishSpy.callCount).toBe(1);
            expect(consoleLogSpy.getCall(2).calledWithMatch(errorMessage)).toBe(true);
        });

        test('Deve logar uma mensagem de erro ao criar novas chaves', async () => {
            // Given
            fsPromisesStub.stat({ isDirectory: true, isFile: true });
            const cliDriverStartSpy = sinon.spy(cliDriver, 'start');
            const cliDriverShowMenuSpy = sinon.spy(cliDriver, 'showMenuAndAskAQuestion');
            const cliAdapterFinishSpy = sinon.spy(cliAdapter, 'finish');
            const errorMessage =
                'O par de chaves de criptografia já existe no caminho especificado.';
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'generate');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cliDriver.start();
            // Then
            expect(cliDriverStartSpy.callCount).toBe(1);
            expect(cliDriverShowMenuSpy.callCount).toBe(1);
            expect(cliAdapterFinishSpy.callCount).toBe(1);
            expect(consoleLogSpy.getCall(2).calledWithMatch(errorMessage)).toBe(true);
        });

        test('Deve logar uma mensagem de erro ao realizar a operação de escrita em disco', async () => {
            // Given
            fsPromisesStub.stat();
            fsPromisesStub.mkdir().throws(new Error('Erro de escrita'));
            const cliDriverStartSpy = sinon.spy(cliDriver, 'start');
            const cliDriverShowMenuSpy = sinon.spy(cliDriver, 'showMenuAndAskAQuestion');
            const cliAdapterFinishSpy = sinon.spy(cliAdapter, 'finish');
            const errorMessage = 'Falha ao salvar o par de chaves de criptografia.';
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'generate');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cliDriver.start();
            // Then
            expect(cliDriverStartSpy.callCount).toBe(1);
            expect(cliDriverShowMenuSpy.callCount).toBe(1);
            expect(cliAdapterFinishSpy.callCount).toBe(1);
            expect(consoleLogSpy.getCall(2).calledWithMatch(errorMessage)).toBe(true);
        });

        test('Deve logar uma mensagem de erro ao tentar recuperar uma chave inexistente', async () => {
            // Given
            const cliDriverStartSpy = sinon.spy(cliDriver, 'start');
            const cliDriverShowMenuSpy = sinon.spy(cliDriver, 'showMenuAndAskAQuestion');
            const cliAdapterFinishSpy = sinon.spy(cliAdapter, 'finish');
            const errorMessage = 'A chave de criptografia não existe no caminho especificado.';
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'get public');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cliDriver.start();
            // Then
            expect(cliDriverStartSpy.callCount).toBe(1);
            expect(cliDriverShowMenuSpy.callCount).toBe(1);
            expect(cliAdapterFinishSpy.callCount).toBe(1);
            expect(consoleLogSpy.getCall(2).calledWithMatch(errorMessage)).toBe(true);
        });

        test('Deve logar uma mensagem de erro ao efetuar a leitura em disco', async () => {
            // Given
            fsPromisesStub.stat({ isDirectory: true, isFile: true });
            fsPromisesStub.readFile().throws(new Error('Erro de leitura'));
            const cliDriverStartSpy = sinon.spy(cliDriver, 'start');
            const cliDriverShowMenuSpy = sinon.spy(cliDriver, 'showMenuAndAskAQuestion');
            const cliAdapterFinishSpy = sinon.spy(cliAdapter, 'finish');
            const errorMessage =
                'A chave de criptografia não pode ser recuperada devido a uma falha no serviço.';
            // When
            readlineQuestionStub.onFirstCall().callsArgWith(1, 'get public');
            readlineQuestionStub.onSecondCall().callsArgWith(1, 'n');
            await cliDriver.start();
            // Then
            expect(cliDriverStartSpy.callCount).toBe(1);
            expect(cliDriverShowMenuSpy.callCount).toBe(1);
            expect(cliAdapterFinishSpy.callCount).toBe(1);
            expect(consoleLogSpy.getCall(2).calledWithMatch(errorMessage)).toBe(true);
        });
    });
});
