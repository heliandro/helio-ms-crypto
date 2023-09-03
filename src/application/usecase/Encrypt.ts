import Crypto from '@app/domain/entity/Crypto';
import CryptoRepository from '../../domain/repository/CryptoRepository';
export default class Encrypt {
    
    constructor(readonly repository: CryptoRepository) {}

    async execute(input: Input): Promise<Output> {
        const keyPair = await this.repository.getKey('public');
        const crypto = new Crypto(keyPair.publicKey, '');
        const encryptedData = crypto.encrypt(input.data);
        return {
            data: encryptedData
        }
    }
}

type Input = {
    data: string
}

type Output = {
    data: any
}