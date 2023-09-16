import { inject, injectable } from 'inversify';
import TYPES from '../../infrastructure/configuration/Types';

import GenerateKeyPairPort from '../ports/GenerateKeyPairPort';

import Crypto from '../../domain/entities/Crypto';
import CryptoRepositoryPort from '../ports/repository/CryptoRepositoryPort';

@injectable()
export default class GenerateKeyPair implements GenerateKeyPairPort {
    constructor(
        @inject(TYPES.CryptoRepositoryFileSystem) readonly repository: CryptoRepositoryPort
    ) {}

    async execute(): Promise<Output> {
        const crypto = await Crypto.create();
        await this.repository.save(crypto.keyPair);
        return {
            message: 'O par de chaves de criptografia foi criado e salvo com sucesso!'
        };
    }
}

export type Input = {};

export type Output = {
    message: string;
};
