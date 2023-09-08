import { inject, injectable } from 'inversify';
import TYPES from '@app/config/Types';
import "reflect-metadata";

import UseCase from './interfaces/UseCase';

import Crypto from '@app/domain/entities/Crypto';
import CryptoRepository from '../../domain/repositories/CryptoRepository';

@injectable()
export default class Decrypt implements UseCase {
    
    constructor(
        @inject(TYPES.CryptoRepositoryFileSystem) readonly repository: CryptoRepository
    ) {}

    async execute(input: Input): Promise<Output> {
        const keyPair = await this.repository.getKey('private');
        const crypto = new Crypto('', keyPair.privateKey);
        const decryptedData = crypto.decrypt(input.data);
        return {
            data: JSON.parse(decryptedData)
        }
    }
}

type Input = {
    data: string
}

type Output = {
    data: any
}