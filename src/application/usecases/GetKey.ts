import { inject, injectable } from 'inversify';
import TYPES from '../../config/Types';

import UseCase from './interfaces/UseCase';

import KeyPair from "../../domain/entities/KeyPair";
import CryptoRepository from "../../domain/repositories/CryptoRepository";
import CryptoKeyType from "../../domain/types/CryptoKeyType";

@injectable()
export default class GetKey implements UseCase {
    
    constructor(
        @inject(TYPES.CryptoRepositoryFileSystem) readonly repository: CryptoRepository
    ) {}

    async execute(input: Input): Promise<Output> {
        const keyPair: KeyPair = await this.repository.getKey(input.keyType);
        return {
            [`${input.keyType}Key`]: keyPair.publicKey || keyPair.privateKey
        }
    }
}

type Input = {
    keyType: CryptoKeyType
}

type Output = {
    publicKey?: string,
    privateKey?: string
}