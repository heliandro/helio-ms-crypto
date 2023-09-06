import { MOCK_PUBLIC_KEY, MOCK_PRIVATE_KEY } from '../utils/KeyPair.constants';
import CryptoRepository from "@app/domain/repositories/CryptoRepository";
import CryptoRepositoryFileSystem from "@app/infrastructure/cryptoRepository/CryptoRepositoryFileSystem";
import * as FileSystemHelper from '../utils/FileSystemHelper';
import sinon from "sinon";
import FileSystem from 'node:fs';
import KeyPair from '@app/domain/entities/KeyPair';

describe('CryptoRepositoryFileSystem', () => {

    let repository: CryptoRepository;
    let stubs: { registry: any[] };

    beforeEach(async () => {
        FileSystemHelper.deleteFolder('./keys');
        repository = new CryptoRepositoryFileSystem();
        stubs = { registry: [] };
    })

    afterEach(() => {
        if (stubs.registry.length) stubs.registry.forEach(stub => stub.restore())
    })

    describe('Cenários de Sucesso', () => {

        test('Deve salvar o par de chaves de criptografia', async () => {
            // Given
            stubs.registry.push(
                sinon.stub(FileSystem, 'existsSync').returns(false),
                sinon.stub(FileSystem, 'mkdirSync').returns(''),
            );
            const stub = sinon.stub(FileSystem, 'writeFileSync').returns()
            const keyPair: KeyPair = new KeyPair(MOCK_PUBLIC_KEY, MOCK_PRIVATE_KEY);
            // When
            await repository.save(keyPair);
            // Then
            expect(stub.callCount).toBe(2)
            stub.restore()
        })

        test('Deve recuperar a chave de criptografia publica', async () => {
            // Given
            stubs.registry.push(
                sinon.stub(FileSystem, 'existsSync').returns(true),
                sinon.stub(FileSystem, 'readFileSync').returns(MOCK_PUBLIC_KEY)
            );
            const keyType: KeyType = 'public';
            // When
            const output = await repository.getKey(keyType);
            // Then
            expect(output.publicKey).toBe(MOCK_PUBLIC_KEY);
        })

        test('Deve recuperar a chave de criptografia privada', async () => {
            // Given
            stubs.registry.push(
                sinon.stub(FileSystem, 'existsSync').returns(true),
                sinon.stub(FileSystem, 'readFileSync').returns(MOCK_PRIVATE_KEY)
            );
            const keyType: KeyType = 'private';
            // When
            const output = await repository.getKey(keyType);
            // Then
            expect(output.privateKey).toBe(MOCK_PRIVATE_KEY);
        });
    });

    describe('Cenários de Erro', () => {
        test('Deve lançar um erro ao tentar recuperar uma chave de criptografia que não existe', async () => {
            // Given
            stubs.registry.push(
                sinon.stub(FileSystem, 'existsSync').returns(false)
            );
            const keyType: KeyType = 'public';
            // When - Then
            await expect(() => repository.getKey(keyType)).rejects.toThrow(new Error('A chave de criptografia não existe no caminho especificado.'));
        })

        test('Deve lançar um erro ao tentar ler o arquivo da chave de criptografia', async () => {
            // Given
            stubs.registry.push(
                sinon.stub(FileSystem, 'existsSync').returns(true),
                sinon.stub(FileSystem, 'readFileSync').throwsException('Erro de leitura')
            );
            const keyType: KeyType = 'private';
            // When - Then
            await expect(() => repository.getKey(keyType)).rejects.toThrow(new Error('A chave de criptografia não pode ser recuperada devido a uma falha no serviço.'));
        });

        test('Deve lançar um erro ao tentar salvar o par de chaves de criptografia', async () => {
            // Given
            stubs.registry.push(
                sinon.stub(FileSystem, 'existsSync').returns(false),
                sinon.stub(FileSystem, 'mkdirSync').throwsException('Erro de escrita')
            );
            const keyPair: KeyPair = new KeyPair(MOCK_PUBLIC_KEY, MOCK_PRIVATE_KEY);
            // When - Then
            await expect(() => repository.save(keyPair)).rejects.toThrow(new Error('Falha ao salvar o par de chaves de criptografia.'));
        });
    });
})