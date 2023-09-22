import { Input, Output } from '../usecases/EncryptUsecase';
import CryptoRepository from '../../application/ports/outbound/CryptoRepository';

export default interface Encrypt {
    readonly repository: CryptoRepository;
    execute(input: Input): Promise<Output>;
}
