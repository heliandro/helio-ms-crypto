import EncryptionAlgorithm from "../../src/domain/value-objects/EncryptionAlgorithm"
import { RSAKeyPairOptions } from "node:crypto"

const mockDefaultOptions: RSAKeyPairOptions<'pem', 'pem'> = {
    modulusLength: 2048,
    publicKeyEncoding: { 
        type: 'spki',
        format: 'pem' 
    },
    privateKeyEncoding: { 
        type: 'pkcs8',
        format: 'pem'
    }
}

describe('EncryptionAlgorithm', () => {

    test('Deve criar o algoritmo de encriptacao passando as opcoes', () => {
        // Given - When
        const encryptionAlgorithm = new EncryptionAlgorithm('rsa', mockDefaultOptions);
        // Then
        expect(encryptionAlgorithm.keyType).toBe('rsa')
        expect(encryptionAlgorithm.options).toStrictEqual(mockDefaultOptions)
    })

    test('Deve criar o algoritmo de encriptacao usando o metodo estatico', () => {
        // Given
        const expectedOtions = { ...mockDefaultOptions, modulusLength: 2048 }
        // When
        const encryptionAlgorithm = EncryptionAlgorithm.create();
        // Then
        expect(encryptionAlgorithm.keyType).toBe('rsa')
        expect(encryptionAlgorithm.options).toStrictEqual(expectedOtions)
    })
})