import { Input, Output } from '../usecases/GetKey';
import CryptoRepositoryPort from './repository/CryptoRepositoryPort';

export default interface GetKeyPort {
    readonly repository: CryptoRepositoryPort;
    execute(input: Input): Promise<Output>;
}