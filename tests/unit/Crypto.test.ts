import Crypto from "@app/domain/entity/Crypto"
import { MOCK_PRIVATE_KEY, MOCK_PUBLIC_KEY } from "@tests/utils/KeyPair.constants"
import sinon from "sinon"
import NodeCrypto from "crypto";

describe('Crypto', () => {
    
    describe('Cenários de Sucesso', () => {
        
        test('Deve gerar o par de chaves de criptografia', async () => {
            // Given - When
            const output = await Crypto.create()
            // Then
            expect(output.publicKey).toBeTruthy()
            expect(output.privateKey).toBeTruthy()
        })

        test('Deve criar uma instancia com o par de chaves válido', async () => {
            // Given - When
            let output: Crypto = new Crypto(MOCK_PUBLIC_KEY, MOCK_PRIVATE_KEY);
            // Then
            expect(output.publicKey).toBeTruthy()
            expect(output.privateKey).toBeTruthy()
        })

        test('Deve encriptar um dado', async () => {
            // Given
            const data = JSON.stringify({ name: 'Heliandro' });
            const crypto = await Crypto.create()
            // When
            const encrypted = crypto.encrypt(data);            
            // Then
            expect(encrypted).toBeTruthy();
        })

        test('Deve desencriptar um dado', async () => {
            // Given
            const data = { name: 'Heliandro' };
            const jsonData = JSON.stringify(data)
            const crypto = await Crypto.create()
            const encrypted = crypto.encrypt(jsonData);
            // When
            const desencripted = crypto.decrypt(encrypted);
            // Then
            expect(JSON.parse(desencripted)).toStrictEqual(data);
        })
    })

    describe('Cenários de Erro', () => {

        test('Deve lançar um erro ao gerar o par de chaves de criptografia', async () => {
            // Given
            const stub = sinon.stub(NodeCrypto, 'generateKeyPairSync').throwsException('Internal error');
            // When - Then
            await expect(() => Crypto.create()).rejects.toThrow(new Error('Falha ao gerar o par de chaves de criptografia.'));
            stub.restore();
        })

        test('Deve lançar um erro ao instanciar com um par de chaves de criptografia inválido', async () => {
            // Given
            const publicKey = 'chavePublica';
            const privateKey = 'chavePrivada';
            // When - Then
            expect(() => new Crypto(publicKey, privateKey)).toThrow(new Error('A(s) chave(s) de criptografia pem são inválidas'));
        })

        test('Deve lançar um erro ao encriptar um dado inválido', async () => {
            // Given
            const stub = sinon.stub(NodeCrypto, 'publicEncrypt').throwsException('Internal error');
            const input = "xpto";
            const crypto = await Crypto.create()
            // When
            expect(() => crypto.encrypt(input)).toThrow(new Error('Falha ao encriptar os dados.'))
            stub.restore();
        })

        test('Deve lançar um erro ao desencriptar um dado inválido', async () => {
            // Given
            const data = JSON.stringify({ name: 'Heliandro' });
            const invalidDataFormatInBase64 = btoa(data);
            const crypto = await Crypto.create()
            // When
            expect(() => crypto.decrypt(invalidDataFormatInBase64)).toThrow(new Error('Falha ao desencriptar os dados.'))
        })
    })
})