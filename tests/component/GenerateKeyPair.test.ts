import { Container } from "inversify";

import * as FileSystemHelper from '../shared/utils/FileSystemHelper';

import DependencyInjectionConfig from "@app/config/DependencyInjectionConfig";
import GenerateKeyPair from "@app/application/usecases/GenerateKeyPair"

describe('GenerateKeyPair', () => {

    let container: Container;
    let usecase: GenerateKeyPair;

    beforeEach(() => {
        container = DependencyInjectionConfig.create();
        usecase = container.get<GenerateKeyPair>(GenerateKeyPair);
        FileSystemHelper.deleteFolder('./keys');
    })

    afterEach(() => {
        container.unbindAll();
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


