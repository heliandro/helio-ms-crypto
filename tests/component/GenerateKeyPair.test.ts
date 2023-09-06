import GenerateKeyPair from "@app/application/usecases/GenerateKeyPair"
import CryptoRepositoryFileSystem from "@app/infrastructure/cryptoRepository/CryptoRepositoryFileSystem"
import CryptoRepository from "@app/domain/repositories/CryptoRepository"
import * as FileSystemHelper from '../utils/FileSystemHelper';

describe('GenerateKeyPair', () => {

    let repository: CryptoRepository;
    let usecase: GenerateKeyPair;

    beforeEach(() => {
        FileSystemHelper.deleteFolder('./keys')
        repository = new CryptoRepositoryFileSystem();
        usecase = new GenerateKeyPair(repository);
    })

    describe('Cenários de Sucesso', () => {
        test('Deve gerar e salvar o par chaves de criptografia', async () => {
            // Given - beforeEach global
            // When
            const output = await usecase.execute();
            // Then
            expect(output).toStrictEqual({ 
                message: 'O par de chaves de criptografia foi criado e salvo com sucesso!',
            });
        });
    });

    describe('Cenários de Erro', () => {
        test('Deve lançar um erro ao tentar salvar um par de chaves quando esse par já existe', async () => {
            // Given - beforeEach global+
            await usecase.execute();
            // When - Then
            await expect(() => usecase.execute()).rejects.toThrow(new Error('O par de chaves de criptografia já existe no caminho especificado.'))
        });
    })
})


