import { Output } from '../GenerateKeyPairUsecase';
import CryptoRepository from '../../ports/outbound/CryptoRepository';

export default interface GenerateKeyPair {
    readonly repository: CryptoRepository;
    execute(): Promise<Output>;
}
