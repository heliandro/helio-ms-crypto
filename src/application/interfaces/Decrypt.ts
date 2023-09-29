import { Input, Output } from '../usecases/DecryptUsecase';
import CryptoRepository from '../../application/ports/outbound/CryptoRepository';

export default interface Decrypt {
    readonly repository: CryptoRepository;
    execute(input: Input): Promise<Output>;
}
