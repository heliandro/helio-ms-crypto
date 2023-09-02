export type Options = {
    modulusLength: number,
    publicKeyEncoding: { type: string, format: string },
    privateKeyEncoding: { type: string, format: string }
}

export default class EncryptionAlgorithm {

    readonly name: any;
    readonly options: any;

    constructor(name?: string, options?: Options) {
        this.name = name ?? 'rsa';
        this.options = options ?? this.defaultOptions();
    }

    static create () {
        return new EncryptionAlgorithm()
    }

    private defaultOptions(): Options {
        return {
            modulusLength: 1024,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        }
    }
}