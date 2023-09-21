import { Input, Output } from '../usecases/Encrypt';
import CryptoRepository from './adapters/CryptoRepository';

export default interface EncryptPort {
    readonly repository: CryptoRepository;
    execute(input: Input): Promise<Output>;
}
