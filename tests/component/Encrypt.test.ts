import FileSystem from 'node:fs';
import sinon from 'sinon';

import DependencyInjectionConfig from "@app/config/DependencyInjectionConfig";

import Encrypt from "@app/application/usecases/Encrypt";
import { MOCK_PUBLIC_KEY } from "../shared/types/KeyPair.constants";
import { Container } from 'inversify';

describe('Encrypt', () => {

    let container: Container;
    let usecase: Encrypt;

    beforeEach(() => {
        container = DependencyInjectionConfig.create();
        usecase = container.get<Encrypt>(Encrypt);
        sinon.stub(FileSystem, 'existsSync').returns(true);
    })

    afterEach(() => {
        container.unbindAll();
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


