import CryptoRepositoryFileSystem from "@app/infrastructure/cryptoRepository/CryptoRepositoryFileSystem"
import CryptoRepository from "@app/domain/repositories/CryptoRepository"
import Encrypt from "@app/application/usecases/Encrypt";
import sinon from 'sinon';
import FileSystem from 'node:fs';
import { MOCK_PUBLIC_KEY } from "@tests/utils/KeyPair.constants";

describe('Encrypt', () => {

    let repository: CryptoRepository;
    let usecase: Encrypt;

    beforeEach(() => {
        repository = new CryptoRepositoryFileSystem();
        usecase = new Encrypt(repository);
        sinon.stub(FileSystem, 'existsSync').returns(true);
    })

    afterEach(() => {
        sinon.restore();
    })

    describe('Cenários de Sucesso', () => {
        test('Deve encriptar um dado', async () => {
            // Given
            sinon.stub(FileSystem, 'readFileSync').returns(MOCK_PUBLIC_KEY);
            const dataObject = { name: 'heliandro' };
            const input = { data: JSON.stringify(dataObject) }
            // When
            const output = await usecase.execute(input);
            // Then
            expect(output.data).toBeTruthy()
        });
    });

    describe('Cenários de Erro', () => {

    })
})


