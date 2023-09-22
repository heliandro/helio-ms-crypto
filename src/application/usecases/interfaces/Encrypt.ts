import { Input, Output } from '../EncryptUsecase';
import CryptoRepository from '../../ports/outbound/CryptoRepository';

export default interface Encrypt {
    readonly repository: CryptoRepository;
    execute(input: Input): Promise<Output>;
}
