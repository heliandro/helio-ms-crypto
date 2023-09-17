import { Input, Output } from '../usecases/Encrypt';
import CryptoRepositoryPort from './adapters/CryptoRepositoryPort';

export default interface EncryptPort {
    readonly repository: CryptoRepositoryPort;
    execute(input: Input): Promise<Output>;
}
