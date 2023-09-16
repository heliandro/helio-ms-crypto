import { inject, injectable } from 'inversify';
import TYPES from '../../infrastructure/configuration/Types';

import EncryptPort from '../ports/EncryptPort';

import Crypto from '../../domain/entities/Crypto';
import CryptoRepositoryPort from '../ports/repository/CryptoRepositoryPort';

@injectable()
export default class Encrypt implements EncryptPort {
    constructor(
        @inject(TYPES.CryptoRepositoryFileSystem) readonly repository: CryptoRepositoryPort
    ) {}

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
