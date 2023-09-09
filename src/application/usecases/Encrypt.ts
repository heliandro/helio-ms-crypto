import { inject, injectable } from 'inversify';
import TYPES from '../../config/Types';

import UseCase from './interfaces/UseCase';

import Crypto from '../../domain/entities/Crypto';
import CryptoRepository from '../../domain/repositories/CryptoRepository';

@injectable()
export default class Encrypt implements UseCase {
    
    constructor(
        @inject(TYPES.CryptoRepositoryFileSystem) readonly repository: CryptoRepository
    ) {}

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