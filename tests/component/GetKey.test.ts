import { Container } from "inversify";
import sinon from "sinon";
import FileSystem from 'node:fs'
import * as FileSystemHelper from '../shared/utils/FileSystemHelper';

import DependencyInjectionConfig from "@app/config/DependencyInjectionConfig";

import GetKey from "@app/application/usecases/GetKey";
import CryptoKeyType from "@app/domain/types/CryptoKeyType";

import { MOCK_PRIVATE_KEY, MOCK_PUBLIC_KEY } from "@tests/shared/types/KeyPair.constants";


describe('GetKey', () => {

    let container: Container;
    let usecase: GetKey;

    beforeEach(async () => {
        container = DependencyInjectionConfig.create();
        usecase = container.get<GetKey>(GetKey);
        FileSystemHelper.deleteFolder('./keys');
    })

    afterEach(() => {
        container.unbindAll();
        sinon.restore();
    })

    describe('Cenários de Sucesso', () => {

        beforeEach(() => {
            sinon.stub(FileSystem, 'existsSync').returns(true);
        })

        test('Deve recuperar a chave de criptografia publica', async () => {
            // Given
            sinon.stub(FileSystem, 'readFileSync').returns(MOCK_PUBLIC_KEY);
            const input: { keyType: CryptoKeyType } = { keyType: 'public' }
            // When
            const output = await usecase.execute(input);
            // Then
            expect(output.publicKey).toBeTruthy();
        })

        test('Deve recuperar a chave de criptografia privada', async () => {
            // Given
            sinon.stub(FileSystem, 'readFileSync').returns(MOCK_PRIVATE_KEY);
            const input: { keyType: CryptoKeyType } = { keyType: 'private' }
            // When
            const output = await usecase.execute(input);
            // Then
            expect(output).toBeTruthy()
        })
    })

    describe('Cenários de Erro', () => {

        beforeEach(() => {
            sinon.stub(FileSystem, 'existsSync').returns(false);
        })

        test('Deve lançar um erro ao tentar recuperar uma chave de criptografia que não existe', async () => {
            // Given
            const input: { keyType: CryptoKeyType } = { keyType: 'public' }
            // When - Then
            await expect(() => usecase.execute(input)).rejects.toThrow(new Error('A chave de criptografia não existe no caminho especificado.'));
        })
    })
})