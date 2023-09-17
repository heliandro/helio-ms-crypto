import { Output } from '../usecases/GenerateKeyPair';
import CryptoRepositoryPort from './adapters/CryptoRepositoryPort';

export default interface GenerateKeyPairPort {
    readonly repository: CryptoRepositoryPort;
    execute(): Promise<Output>;
}
