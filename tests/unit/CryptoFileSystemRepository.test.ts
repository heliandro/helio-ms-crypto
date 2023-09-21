import { Container } from 'inversify';
import fsPromise from 'node:fs/promises';
import sinon from 'sinon';
import TYPES from '../../src/infrastructure/configuration/Types';

import CryptoRepository from '../../src/application/ports/adapters/CryptoRepository';
import KeyPair from '../../src/domain/entities/KeyPair';
import CryptoKeyType from '../../src/domain/types/CryptoKeyType';
import DependencyInjection from '../../src/infrastructure/configuration/DependencyInjection';

import { MOCK_PUBLIC_KEY, MOCK_PRIVATE_KEY } from '../shared/types/KeyPair.constants';
import { deleteFolder } from '../shared/utils/FileSystemHelper';
import fsPromisesStub from '../shared/stubs/fsPromisesStub';

describe('CryptoFileSystemRepository', () => {
    let repository: CryptoRepository;
    let container: Container;

    beforeEach(() => {
        deleteFolder('./keys');
        container = DependencyInjection.create();
        repository = container.get<CryptoRepository>(TYPES.CryptoFileSystemRepository);
    });

    afterEach(async () => {
        container.unbindAll();
        sinon.restore();
    });

    describe('Cenários de Sucesso', () => {
        test('Deve salvar o par de chaves de criptografia', async () => {
            // Given
            fsPromisesStub.stat({ isDirectory: true });
            const mkdirStub = fsPromisesStub.mkdir();
            const writeFileStub = fsPromisesStub.writeFile();
            const keyPair: KeyPair = new KeyPair(MOCK_PUBLIC_KEY, MOCK_PRIVATE_KEY);
            // When
            await repository.save(keyPair);
            // Then
            expect(mkdirStub.callCount).toBe(0);
            expect(writeFileStub.callCount).toBe(2);
        });

        test('Deve recuperar a chave de criptografia publica', async () => {
            // Given
            fsPromisesStub.stat({ isDirectory: true, isFile: true });
            sinon.stub(fsPromise, 'readFile').resolves(MOCK_PUBLIC_KEY);
            const keyType: CryptoKeyType = 'public';
            // When
            const output = await repository.getKey(keyType);
            // Then
            expect(output.publicKey).toBe(MOCK_PUBLIC_KEY);
        });

        test('Deve recuperar a chave de criptografia privada', async () => {
            // Given
            fsPromisesStub.stat({ isDirectory: true, isFile: true });
            fsPromisesStub.readFile(MOCK_PRIVATE_KEY);
            const keyType: CryptoKeyType = 'private';
            // When
            const output = await repository.getKey(keyType);
            // Then
            expect(output.privateKey).toBe(MOCK_PRIVATE_KEY);
        });
    });

    describe('Cenários de Erro', () => {
        test('Deve lançar um erro ao tentar recuperar uma chave de criptografia que não existe', async () => {
            // Given
            fsPromisesStub.stat();
            const keyType: CryptoKeyType = 'public';
            // When - Then
            await expect(() => repository.getKey(keyType)).rejects.toThrow(
                new Error('A chave de criptografia não existe no caminho especificado.')
            );
        });

        test('Deve lançar um erro ao tentar ler o arquivo da chave de criptografia', async () => {
            // Given
            fsPromisesStub.stat({ isFile: true });
            fsPromisesStub.readFile().throwsException('Erro de leitura');
            const keyType: CryptoKeyType = 'private';
            // When - Then
            await expect(() => repository.getKey(keyType)).rejects.toThrow(
                new Error(
                    'A chave de criptografia não pode ser recuperada devido a uma falha no serviço.'
                )
            );
        });

        test('Deve lançar um erro ao tentar salvar o par de chaves de criptografia', async () => {
            // Given
            fsPromisesStub.stat();
            fsPromisesStub.mkdir().throwsException('Erro ao criar a pasta');
            const keyPair: KeyPair = new KeyPair(MOCK_PUBLIC_KEY, MOCK_PRIVATE_KEY);
            // When - Then
            await expect(() => repository.save(keyPair)).rejects.toThrow(
                new Error('Falha ao salvar o par de chaves de criptografia.')
            );
        });
    });
});
