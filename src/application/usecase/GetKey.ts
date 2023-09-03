import KeyPair from "@app/domain/entity/KeyPair";
import CryptoRepository from "@app/domain/repository/CryptoRepository";

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
    keyType: KeyType
}

type Output = {
    publicKey?: string,
    privateKey?: string
}