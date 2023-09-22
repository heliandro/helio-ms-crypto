import { Input, Output } from '../usecases/GetKeyUsecase';
import CryptoRepository from '../../application/ports/outbound/CryptoRepository';

export default interface GetKey {
    readonly repository: CryptoRepository;
    execute(input: Input): Promise<Output>;
}
