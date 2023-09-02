import EncryptionAlgorithm from '../value-object/EncryptionAlgorithm';
import KeyPair from './KeyPair';
import NodeCrypto from 'crypto'

export default class Crypto {

    readonly keyPair: KeyPair;

    constructor(readonly publicKey: string, readonly privateKey: string) {
        this.keyPair = new KeyPair(publicKey, privateKey)
    }

    static create () {
        try {
            const encryptionAlgorithm = EncryptionAlgorithm.create()
            const { publicKey, privateKey } = NodeCrypto.generateKeyPairSync(encryptionAlgorithm.name, encryptionAlgorithm.options)
            return new Crypto(publicKey, privateKey)
        } catch (error: any) {
            console.error(error.message)
            throw new Error('Error on generate key pair')
        }
    }

    encrypt(data: any): Promise<any> {
        throw new Error('Method not implemented.');
    }

    decrypt(data: any): Promise<any> {
        throw new Error('Method not implemented.');
    }
}