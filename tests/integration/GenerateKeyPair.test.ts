import { Container } from 'inversify';

import * as FileSystemHelper from '../shared/utils/FileSystemHelper';

import DependencyInjection from '../../src/infrastructure/configuration/DependencyInjection';
import GenerateKeyPairUsecase from '../../src/application/usecases/GenerateKeyPairUsecase';
import GenerateKeyPair from '../../src/application/usecases/interfaces/GenerateKeyPair';
import TYPES from '../../src/infrastructure/configuration/Types';

describe('GenerateKeyPair', () => {
    let container: Container;
    let usecase: GenerateKeyPairUsecase;

    beforeEach(() => {
        container = DependencyInjection.create();
        usecase = container.get<GenerateKeyPair>(TYPES.GenerateKeyPairUsecase);
        FileSystemHelper.deleteFolder('./keys');
    });

    afterEach(() => {
        container.unbindAll();
    });

    describe('Cenários de Sucesso', () => {
        test('Deve gerar e salvar o par chaves de criptografia', async () => {
            // Given - beforeEach global
            // When
            const output = await usecase.execute();
            // Then
            expect(output).toStrictEqual({
                message: 'O par de chaves de criptografia foi criado e salvo com sucesso!'
            });
        });
    });

    describe('Cenários de Erro', () => {
        test('Deve lançar um erro ao tentar salvar um par de chaves quando esse par já existe', async () => {
            // Given - beforeEach global+
            await usecase.execute();
            // When - Then
            await expect(() => usecase.execute()).rejects.toThrow(
                new Error('O par de chaves de criptografia já existe no caminho especificado.')
            );
        });
    });
});
