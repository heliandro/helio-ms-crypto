import { Output } from '../usecases/GenerateKeyPair';
import CryptoRepository from './adapters/CryptoRepository';

export default interface GenerateKeyPairPort {
    readonly repository: CryptoRepository;
    execute(): Promise<Output>;
}
