import { Input, Output } from '../usecases/GetKey';
import CryptoRepository from './adapters/CryptoRepository';

export default interface GetKeyPort {
    readonly repository: CryptoRepository;
    execute(input: Input): Promise<Output>;
}
