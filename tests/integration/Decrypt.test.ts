import { Container } from 'inversify';
import sinon from 'sinon';

import DependencyInjection from '../../src/infrastructure/configuration/DependencyInjection';
import Crypto from '../../src/domain/entities/Crypto';
import Decrypt from '../../src/application/usecases/Decrypt';

import { MOCK_PRIVATE_KEY, MOCK_PUBLIC_KEY } from '../shared/types/KeyPair.constants';
import DecryptPort from '../../src/application/ports/DecryptPort';
import TYPES from '../../src/infrastructure/configuration/Types';
import fsPromisesStub from '../shared/stubs/fsPromisesStub';

describe('Decrypt', () => {
    let container: Container;
    let usecase: Decrypt;

    beforeEach(() => {
        container = DependencyInjection.create();
        usecase = container.get<DecryptPort>(TYPES.Decrypt);
        fsPromisesStub.stat({ isDirectory: true, isFile: true });
    });

    afterEach(() => {
        container.unbindAll();
        sinon.restore();
    });

    describe('Cenários de Sucesso', () => {
        test('Deve desencriptar um dado', async () => {
            // Given
            const jsonData = JSON.stringify({ name: 'heliandro' });
            const crypto = new Crypto(MOCK_PUBLIC_KEY, '');
            const encryptedData = crypto.encrypt(jsonData);
            const input = { data: encryptedData };
            fsPromisesStub.readFile(MOCK_PRIVATE_KEY);
            // When
            const output = await usecase.execute(input);
            // Then
            expect(output.data).toBeTruthy();
        });
    });

    describe('Cenários de Erro', () => {});
});
