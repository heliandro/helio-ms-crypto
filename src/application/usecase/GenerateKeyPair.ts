import Crypto from '@app/domain/entity/Crypto'
import CryptoRepository from '@app/domain/repository/CryptoRepository';

export default class GenerateKeys {

    constructor(readonly cryptoRepository: CryptoRepository) {}

    async execute (): Promise<Output> {
        const crypto = Crypto.create()
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