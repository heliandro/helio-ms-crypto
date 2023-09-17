import KeyPair from '../../src/domain/entities/KeyPair';
import { MOCK_PRIVATE_KEY, MOCK_PUBLIC_KEY } from '../shared/types/KeyPair.constants';

describe('KeyPair', () => {
    test('Deve criar uma instanciar da classe usando uma chave publica válida', () => {
        const keyPair = new KeyPair(MOCK_PUBLIC_KEY, '');
        expect(keyPair.publicKey).toBe(MOCK_PUBLIC_KEY);
    });

    test('Deve criar uma instanciar da classe usando uma chave privada válida', () => {
        const keyPair = new KeyPair('', MOCK_PRIVATE_KEY);
        expect(keyPair.privateKey).toBe(MOCK_PRIVATE_KEY);
    });

    test('Deve lançar um erro ao instanciar a classe com uma chave publica inválida', () => {
        expect(() => new KeyPair('chave publica inválida', '')).toThrow(
            new Error(`A(s) chave(s) de criptografia pem são inválidas`)
        );
    });

    test('Deve lançar um erro ao instanciar a classe com uma chave privada inválida', () => {
        expect(() => new KeyPair('', 'chave privada inválida')).toThrow(
            new Error(`A(s) chave(s) de criptografia pem são inválidas`)
        );
    });
});
