import KeyPair from "../entity/KeyPair";

export default interface CryptoRepository {

    save(keyPair: KeyPair): Promise<void>;
    getKeyPair(): Promise<any>;
}