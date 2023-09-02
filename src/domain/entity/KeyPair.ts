export default class KeyPair {

    readonly publicKey: string;
    readonly privateKey: string;

    constructor(publicKey: string, privateKey: string) {
        this.publicKey = publicKey
        this.privateKey = privateKey
    }
}