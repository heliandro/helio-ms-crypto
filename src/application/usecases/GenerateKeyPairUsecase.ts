import { inject, injectable } from 'inversify';
import TYPES from '../../infrastructure/configuration/Types';

import GenerateKeyPair from './interfaces/GenerateKeyPair';

import Crypto from '../../domain/entities/Crypto';
import CryptoRepository from '../ports/outbound/CryptoRepository';

@injectable()
export default class GenerateKeyPairUsecase implements GenerateKeyPair {
    constructor(@inject(TYPES.CryptoFileSystemRepository) readonly repository: CryptoRepository) {}

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
