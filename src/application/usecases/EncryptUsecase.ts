import { inject, injectable } from 'inversify';
import TYPES from '../../infrastructure/configuration/Types';

import Encrypt from './interfaces/Encrypt';

import Crypto from '../../domain/entities/Crypto';
import CryptoRepository from '../ports/outbound/CryptoRepository';

@injectable()
export default class EncryptUsecase implements Encrypt {
    constructor(@inject(TYPES.CryptoFileSystemRepository) readonly repository: CryptoRepository) {}

    async execute(input: Input): Promise<Output> {
        const keyPair = await this.repository.getKey('public');
        const crypto = new Crypto(keyPair.publicKey, '');
        const encryptedData = crypto.encrypt(input.data);
        return {
            data: encryptedData
        };
    }
}

export type Input = {
    data: string;
};

export type Output = {
    data: any;
};
