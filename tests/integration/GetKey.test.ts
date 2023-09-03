import GenerateKeyPair from "@app/application/usecase/GenerateKeyPair";
import CryptoRepository from "@app/domain/repository/CryptoRepository";
import CryptoRepositoryFileSystem from "@app/infra/repository/CryptoRepositoryFileSystem";
import * as FileSystemHelper from '../utils/FileSystemHelper';
import GetKey from "@app/application/usecase/GetKey";

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
            const input: { keyType: KeyType } = { keyType: 'public' }
            // When
            const output = await usecase.execute(input);
            // Then
            expect(output.publicKey).toBeTruthy();
        })

        test('Deve recuperar a chave de criptografia privada', async () => {
            // Given
            const input: { keyType: KeyType } = { keyType: 'private' }
            // When
            const output = await usecase.execute(input);
            // Then
            expect(output).toBeTruthy()
        })
    })

    describe('Cenários de Erro', () => {
        test('Deve lançar um erro ao tentar recuperar uma chave de criptografia que não existe', async () => {
            // Given
            const input: { keyType: KeyType } = { keyType: 'public' }
            // When - Then
            await expect(() => usecase.execute(input)).rejects.toThrow(new Error('A chave de criptografia não existe no caminho especificado.'));
        })
    })
})