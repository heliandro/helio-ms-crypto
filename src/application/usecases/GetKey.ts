import { inject, injectable } from 'inversify';
import TYPES from '../../infrastructure/configuration/Types';

import GetKeyPort from '../ports/GetKeyPort';

import KeyPair from '../../domain/entities/KeyPair';
import CryptoRepositoryPort from '../ports/adapters/CryptoRepositoryPort';
import CryptoKeyType from '../../domain/types/CryptoKeyType';

@injectable()
export default class GetKey implements GetKeyPort {
    constructor(
        @inject(TYPES.CryptoRepositoryFileSystem) readonly repository: CryptoRepositoryPort
    ) {}

    async execute(input: Input): Promise<Output> {
        const keyPair: KeyPair = await this.repository.getKey(input.keyType);
        return {
            [`${input.keyType}Key`]: keyPair.publicKey || keyPair.privateKey
        };
    }
}

export type Input = {
    keyType: CryptoKeyType;
};

export type Output = {
    publicKey?: string;
    privateKey?: string;
};
