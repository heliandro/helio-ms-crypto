import { Input, Output } from '../GetKeyUsecase';
import CryptoRepository from '../../ports/outbound/CryptoRepository';

export default interface GetKey {
    readonly repository: CryptoRepository;
    execute(input: Input): Promise<Output>;
}
