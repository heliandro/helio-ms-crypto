import Crypto from '@app/domain/entity/Crypto';
import CryptoRepository from '../../domain/repository/CryptoRepository';

export default class Decrypt {
    
    constructor(readonly repository: CryptoRepository) {}

    async execute(input: Input): Promise<Output> {
        const keyPair = await this.repository.getKey('private');
        const crypto = new Crypto('', keyPair.privateKey);
        const decryptedData = crypto.decrypt(input.data);
        return {
            data: decryptedData
        }
    }
}

type Input = {
    data: string
}

type Output = {
    data: any
}