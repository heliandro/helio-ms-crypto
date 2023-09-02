import * as FileSystem from "fs"
import GenerateKeyPair from "@app/application/usecase/GenerateKeyPair"
import CryptoRepositoryFileSystem from "@app/infra/repository/CryptoRepositoryFileSystem"

const deleteKeyFolder = () => {
    FileSystem.rmSync('./keys', { recursive: true, force: true })
}

test('Deve gerar as chaves de criptografia', async () => {
    // Given
    const repository = new CryptoRepositoryFileSystem();
    const usecase = new GenerateKeyPair(repository);
    // When
    deleteKeyFolder()
    const output = await usecase.execute();
    // Then
    expect(output).toStrictEqual({ 
        message: 'O par de chaves de criptografia foi criado e salvo com sucesso!',
    });
})