import { inject, injectable } from 'inversify';
import { TYPES } from '@app/config/Types';
import "reflect-metadata";

import Crypto from '@app/domain/entities/Crypto'
import CryptoRepository from '@app/domain/repositories/CryptoRepository';
import { UseCase } from './interfaces/UseCase';

@injectable()
export default class GenerateKeyPair implements UseCase {

    constructor(
        @inject(TYPES.CryptoRepositoryFileSystem) readonly repository: CryptoRepository
    ) {}

    async execute (): Promise<Output> {
        const crypto = await Crypto.create()
        await this.repository.save(crypto.keyPair)
        return { 
            message: 'O par de chaves de criptografia foi criado e salvo com sucesso!',
        };
    }
}

type Input = {}

type Output = {
    message: string
}