import { Input, Output } from '../usecases/GetKey';
import CryptoRepositoryPort from './adapters/CryptoRepositoryPort';

export default interface GetKeyPort {
    readonly repository: CryptoRepositoryPort;
    execute(input: Input): Promise<Output>;
}
