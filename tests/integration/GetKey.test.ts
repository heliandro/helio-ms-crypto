import { Container } from 'inversify';
import sinon from 'sinon';
import * as FileSystemHelper from '../shared/utils/FileSystemHelper';

import DependencyInjection from '../../src/infrastructure/configuration/DependencyInjection';
import GetKey from '../../src/application/usecases/GetKey';
import GetKeyPort from '../../src/application/ports/GetKeyPort';
import CryptoKeyType from '../../src/domain/types/CryptoKeyType';

import { MOCK_PRIVATE_KEY, MOCK_PUBLIC_KEY } from '../shared/types/KeyPair.constants';
import TYPES from '../../src/infrastructure/configuration/Types';
import fsPromisesStub from '../shared/stubs/fsPromisesStub';

describe('GetKey', () => {
    let container: Container;
    let usecase: GetKey;

    beforeEach(async () => {
        container = DependencyInjection.create();
        usecase = container.get<GetKeyPort>(TYPES.GetKey);
        FileSystemHelper.deleteFolder('./keys');
    });

    afterEach(() => {
        container.unbindAll();
        sinon.restore();
    });

    describe('Cenários de Sucesso', () => {
        beforeEach(() => {
            fsPromisesStub.stat({ isDirectory: true, isFile: true });
        });

        test('Deve recuperar a chave de criptografia publica', async () => {
            // Given
            fsPromisesStub.readFile(MOCK_PUBLIC_KEY);
            const input: { keyType: CryptoKeyType } = { keyType: 'public' };
            // When
            const output = await usecase.execute(input);
            // Then
            expect(output.publicKey).toBeTruthy();
        });

        test('Deve recuperar a chave de criptografia privada', async () => {
            // Given
            fsPromisesStub.readFile(MOCK_PRIVATE_KEY);
            const input: { keyType: CryptoKeyType } = { keyType: 'private' };
            // When
            const output = await usecase.execute(input);
            // Then
            expect(output).toBeTruthy();
        });
    });

    describe('Cenários de Erro', () => {
        beforeEach(() => {
            fsPromisesStub.stat();
        });

        test('Deve lançar um erro ao tentar recuperar uma chave de criptografia que não existe', async () => {
            // Given
            const input: { keyType: CryptoKeyType } = { keyType: 'public' };
            // When - Then
            await expect(() => usecase.execute(input)).rejects.toThrow(
                new Error('A chave de criptografia não existe no caminho especificado.')
            );
        });
    });
});
