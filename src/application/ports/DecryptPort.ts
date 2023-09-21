import { Input, Output } from '../usecases/Decrypt';
import CryptoRepository from './adapters/CryptoRepository';

export default interface DecryptPort {
    readonly repository: CryptoRepository;
    execute(input: Input): Promise<Output>;
}
