import fsPromisesStub from './../shared/stubs/fsPromisesStub';
import sinon from 'sinon';

import DependencyInjection from '../../src/infrastructure/configuration/DependencyInjection';
import Encrypt from '../../src/application/usecases/interfaces/Encrypt';
import EncryptUsecase from '../../src/application/usecases/EncryptUsecase';

import { MOCK_PUBLIC_KEY } from '../shared/types/KeyPair.constants';
import { Container } from 'inversify';
import TYPES from '../../src/infrastructure/configuration/Types';

describe('Encrypt', () => {
    let container: Container;
    let usecase: EncryptUsecase;

    beforeEach(() => {
        container = DependencyInjection.create();
        usecase = container.get<Encrypt>(TYPES.EncryptUsecase);
        fsPromisesStub.stat({ isDirectory: true, isFile: true });
    });

    afterEach(() => {
        container.unbindAll();
        sinon.restore();
    });

    describe('Cenários de Sucesso', () => {
        test('Deve encriptar um dado', async () => {
            // Given
            fsPromisesStub.readFile(MOCK_PUBLIC_KEY);
            const dataObject = { name: 'heliandro' };
            const input = { data: JSON.stringify(dataObject) };
            // When
            const output = await usecase.execute(input);
            // Then
            expect(output.data).toBeTruthy();
        });
    });

    describe('Cenários de Erro', () => {});
});
