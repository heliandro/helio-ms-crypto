import KeyPair from "../entities/KeyPair";

export default interface CryptoRepository {

    save(keyPair: KeyPair): Promise<void>;
    getKey(type: KeyType): Promise<KeyPair>;
}