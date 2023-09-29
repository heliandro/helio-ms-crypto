import { Input, Output } from '../DecryptUsecase';
import CryptoRepository from '../../ports/outbound/CryptoRepository';

export default interface Decrypt {
    readonly repository: CryptoRepository;
    execute(input: Input): Promise<Output>;
}
