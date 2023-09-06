import KeyPair from "@app/domain/entities/KeyPair";
import CryptoRepository from "@app/domain/repositories/CryptoRepository";
import { CryptoKeyType } from "@app/domain/types/CryptoKeyType";

export default class GetKey {
    
    constructor(readonly repository: CryptoRepository) {}

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