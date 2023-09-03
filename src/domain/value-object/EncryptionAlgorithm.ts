import { RSAKeyPairOptions } from "crypto";

type KeyType = 'rsa';

const defaultOptions: RSAKeyPairOptions<'pem', 'pem'> = {
    modulusLength: 1024,
    publicKeyEncoding: { 
        type: 'spki',
        format: 'pem' 
    },
    privateKeyEncoding: { 
        type: 'pkcs8',
        format: 'pem'
    }
}

export default class EncryptionAlgorithm {

    readonly keyType: KeyType;
    readonly options: RSAKeyPairOptions<'pem', 'pem'>;

    constructor(name: KeyType, options: RSAKeyPairOptions<'pem', 'pem'>) {
        this.keyType = name;
        this.options = options;
    }

    static create () {
        return new EncryptionAlgorithm('rsa', defaultOptions)
    }
}