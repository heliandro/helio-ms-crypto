export default class KeyPair {

    readonly publicKey: string;
    readonly privateKey: string;

    constructor(publicKey: string, privateKey: string) {
        if (publicKey && !this.validate(publicKey) || privateKey && !this.validate(privateKey))
            throw new Error(`A(s) chave(s) de criptografia pem são inválidas`)
        
        this.publicKey = publicKey
        this.privateKey = privateKey
    }

    validate(key: string) {
        const pemKeyRegex = /^(-----BEGIN [A-Z ]+-----\r?\n?[\/+=A-Za-z0-9\r?\n?]+-----END [A-Z ]+-----\r?\n?)$/;
        return pemKeyRegex.test(key);
    }
}