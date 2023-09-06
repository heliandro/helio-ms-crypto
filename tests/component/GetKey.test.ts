import GenerateKeyPair from "@app/application/usecases/GenerateKeyPair";
import CryptoRepository from "@app/domain/repositories/CryptoRepository";
import CryptoRepositoryFileSystem from "@app/infrastructure/cryptoRepository/CryptoRepositoryFileSystem";
import * as FileSystemHelper from '../utils/FileSystemHelper';
import GetKey from "@app/application/usecases/GetKey";
import { CryptoKeyType } from "@app/domain/types/CryptoKeyType";

describe('GetKey', () => {

    let repository: CryptoRepository;
    let generateKeyPair: GenerateKeyPair;
    let usecase: GetKey;

    beforeEach(async () => {
        repository = new CryptoRepositoryFileSystem();
        generateKeyPair = new GenerateKeyPair(repository);
        FileSystemHelper.deleteFolder('./keys');
        usecase = new GetKey(repository);
    })

    describe('Cenários de Sucesso', () => {

        beforeEach(async () => {
            await generateKeyPair.execute();
        })

        test('Deve recuperar a chave de criptografia publica', async () => {
            // Given
            const input: { keyType: CryptoKeyType } = { keyType: 'public' }
            // When
            const output = await usecase.execute(input);
            // Then
            expect(output.publicKey).toBeTruthy();
        })

        test('Deve recuperar a chave de criptografia privada', async () => {
            // Given
            const input: { keyType: CryptoKeyType } = { keyType: 'private' }
            // When
            const output = await usecase.execute(input);
            // Then
            expect(output).toBeTruthy()
        })
    })

    describe('Cenários de Erro', () => {
        test('Deve lançar um erro ao tentar recuperar uma chave de criptografia que não existe', async () => {
            // Given
            const input: { keyType: CryptoKeyType } = { keyType: 'public' }
            // When - Then
            await expect(() => usecase.execute(input)).rejects.toThrow(new Error('A chave de criptografia não existe no caminho especificado.'));
        })
    })
})