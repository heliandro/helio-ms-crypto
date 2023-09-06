import CryptoRepositoryFileSystem from "@app/infrastructure/cryptoRepository/CryptoRepositoryFileSystem"
import CryptoRepository from "@app/domain/repositories/CryptoRepository"
import sinon from 'sinon';
import FileSystem from 'node:fs';
import { MOCK_PRIVATE_KEY, MOCK_PUBLIC_KEY } from "@tests/utils/KeyPair.constants";
import Decrypt from "@app/application/usecases/Decrypt";
import Crypto from "@app/domain/entities/Crypto";

describe('Decrypt', () => {

    let repository: CryptoRepository;
    let usecase: Decrypt;

    beforeEach(() => {
        repository = new CryptoRepositoryFileSystem();
        usecase = new Decrypt(repository);
        sinon.stub(FileSystem, 'existsSync').returns(true);
    })

    afterEach(() => {
        sinon.restore();
    })

    describe('Cenários de Sucesso', () => {
        test('Deve desencriptar um dado', async () => {
            // Given
            const jsonData = JSON.stringify({ name: 'heliandro' });
            const crypto = new Crypto(MOCK_PUBLIC_KEY, '')
            const encryptedData = crypto.encrypt(jsonData);
            const input = { data: encryptedData }
            sinon.stub(FileSystem, 'readFileSync').returns(MOCK_PRIVATE_KEY);
            // When
            const output = await usecase.execute(input);
            // Then
            expect(output.data).toBeTruthy()
        });
    });

    describe('Cenários de Erro', () => {

    })
})


