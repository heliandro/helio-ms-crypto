import { inject, injectable } from 'inversify';
import TYPES from '../../config/Types';
import "reflect-metadata";

import UseCase from './interfaces/UseCase';

import Crypto from '../../domain/entities/Crypto'
import CryptoRepository from '../../domain/repositories/CryptoRepository';

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