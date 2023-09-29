import { Output } from '../usecases/GenerateKeyPairUsecase';
import CryptoRepository from '../../application/ports/outbound/CryptoRepository';

export default interface GenerateKeyPair {
    readonly repository: CryptoRepository;
    execute(): Promise<Output>;
}
