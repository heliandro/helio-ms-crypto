import KeyPair from "../entities/KeyPair";
import CryptoKeyType from "../types/CryptoKeyType";

export default interface CryptoRepository {

    save(keyPair: KeyPair): Promise<void>;
    getKey(type: CryptoKeyType): Promise<KeyPair>;
}