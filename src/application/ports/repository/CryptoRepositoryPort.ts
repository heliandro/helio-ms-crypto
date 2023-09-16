import KeyPair from "../../../domain/entities/KeyPair";
import CryptoKeyType from "../../../domain/types/CryptoKeyType";

export default interface CryptoRepositoryPort {
    save(keyPair: KeyPair): Promise<void>;
    getKey(type: CryptoKeyType): Promise<KeyPair>;
}