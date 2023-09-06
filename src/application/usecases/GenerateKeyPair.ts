import Crypto from '@app/domain/entities/Crypto'
import CryptoRepository from '@app/domain/repositories/CryptoRepository';

export default class GenerateKeyPair {

    constructor(readonly cryptoRepository: CryptoRepository) {}

    async execute (): Promise<Output> {
        const crypto = await Crypto.create()
        await this.cryptoRepository.save(crypto.keyPair)
        return { 
            message: 'O par de chaves de criptografia foi criado e salvo com sucesso!',
        };
    }
}

type Input = {}

type Output = {
    message: string
}