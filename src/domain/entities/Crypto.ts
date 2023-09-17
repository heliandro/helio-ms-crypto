import EncryptionAlgorithm from '../value-objects/EncryptionAlgorithm';
import KeyPair from './KeyPair';
import NodeCrypto from 'crypto';

export default class Crypto {
    readonly keyPair: KeyPair;

    constructor(
        readonly publicKey: string,
        readonly privateKey: string
    ) {
        this.keyPair = new KeyPair(publicKey, privateKey);
    }

    static async create(): Promise<Crypto> {
        try {
            const encryptionAlgorithm = EncryptionAlgorithm.create();
            const { publicKey, privateKey } = NodeCrypto.generateKeyPairSync(
                encryptionAlgorithm.keyType,
                encryptionAlgorithm.options
            );
            return new Crypto(publicKey, privateKey);
        } catch (error: any) {
            console.error(error.message);
            throw new Error('Falha ao gerar o par de chaves de criptografia.');
        }
    }

    encrypt(data: string): string {
        try {
            const encryptedData = NodeCrypto.publicEncrypt(
                {
                    key: this.keyPair.publicKey,
                    padding: NodeCrypto.constants.RSA_PKCS1_PADDING
                },
                Buffer.from(data)
            );

            return encryptedData.toString('base64');
        } catch (error: any) {
            console.error(error.message);
            throw new Error('Falha ao encriptar os dados.');
        }
    }

    decrypt(data: string): string {
        const encryptedData = Buffer.from(data, 'base64');

        try {
            const decryptedDataBuffer = NodeCrypto.privateDecrypt(
                {
                    key: this.keyPair.privateKey,
                    padding: NodeCrypto.constants.RSA_PKCS1_PADDING
                },
                encryptedData
            );

            return decryptedDataBuffer.toString();
        } catch (error: any) {
            console.error(error.message);
            throw new Error('Falha ao desencriptar os dados.');
        }
    }
}
