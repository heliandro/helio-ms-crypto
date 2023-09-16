import { inject, injectable } from 'inversify';
import TYPES from '../../infrastructure/configuration/Types';

import DecryptPort from '../ports/DecryptPort';

import Crypto from '../../domain/entities/Crypto';
import CryptoRepositoryPort from '../ports/repository/CryptoRepositoryPort';

@injectable()
export default class Decrypt implements DecryptPort {
    constructor(
        @inject(TYPES.CryptoRepositoryFileSystem) readonly repository: CryptoRepositoryPort
    ) {}

    async execute(input: Input): Promise<Output> {
        const keyPair = await this.repository.getKey('private');
        const crypto = new Crypto('', keyPair.privateKey);
        const decryptedData = crypto.decrypt(input.data);
        return {
            data: JSON.parse(decryptedData)
        };
    }
}

export type Input = {
    data: string;
};

export type Output = {
    data: any;
};
