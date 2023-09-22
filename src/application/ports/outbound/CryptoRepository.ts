import KeyPair from '../../../domain/entities/KeyPair';
import CryptoKeyType from '../../../domain/types/CryptoKeyType';

export default interface CryptoRepository {
    save(keyPair: KeyPair): Promise<void>;
    getKey(type: CryptoKeyType): Promise<KeyPair>;
}
