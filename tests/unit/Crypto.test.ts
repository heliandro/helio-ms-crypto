import Crypto from "@app/domain/entity/Crypto"
import { MOCK_PRIVATE_KEY, MOCK_PUBLIC_KEY } from "@tests/utils/KeyPair.constants"
import sinon from "sinon"
import NodeCrypto from "crypto";

describe('Crypto', () => {

    // let crypto: Crypto
    // afterEach(() => {
    //     sinon.restore()
    // })
    
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
    })
})