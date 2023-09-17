import { Input, Output } from '../usecases/Decrypt';
import CryptoRepositoryPort from './adapters/CryptoRepositoryPort';

export default interface DecryptPort {
    readonly repository: CryptoRepositoryPort;
    execute(input: Input): Promise<Output>;
}
