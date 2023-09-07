import FileSystem from 'node:fs';
import sinon from 'sinon';
import DIContainer from "@app/config/DependencyInjectionConfig";

import Encrypt from "@app/application/usecases/Encrypt";
import { MOCK_PUBLIC_KEY } from "@tests/utils/KeyPair.constants";

describe('Encrypt', () => {

    let usecase: Encrypt = DIContainer.get<Encrypt>(Encrypt);

    beforeEach(() => {
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


