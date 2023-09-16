import { Input, Output } from '../usecases/Encrypt';
import CryptoRepositoryPort from './repository/CryptoRepositoryPort';

export default interface EncryptPort {
    readonly repository: CryptoRepositoryPort;
    execute(input: Input): Promise<Output>;
}
