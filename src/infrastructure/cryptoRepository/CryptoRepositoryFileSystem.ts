import { injectable } from "inversify";
import "reflect-metadata";
import * as FileSystem from "node:fs";

import KeyPair from "@app/domain/entities/KeyPair";
import CryptoRepository from "@app/domain/repositories/CryptoRepository";
import CryptoKeyType from "@app/domain/types/CryptoKeyType";

const PATH_KEY_FOLDER = './keys'
const PATH_PUBLIC_KEY = `${PATH_KEY_FOLDER}/public_key.pem`
const PATH_PRIVATE_KEY = `${PATH_KEY_FOLDER}/private_key.pem`

const isAnyKeyPairExistsInPath = (): boolean => {
    return FileSystem.existsSync(PATH_PUBLIC_KEY) || FileSystem.existsSync(PATH_PRIVATE_KEY)
}

@injectable()
export default class CryptoRepositoryFileSystem implements CryptoRepository {

    async save(keyPair: KeyPair): Promise<void> {
        if (isAnyKeyPairExistsInPath())
            throw new Error('O par de chaves de criptografia já existe no caminho especificado.')
    
        try {
            FileSystem.mkdirSync(PATH_KEY_FOLDER)
            FileSystem.writeFileSync(PATH_PUBLIC_KEY, keyPair.publicKey);
            FileSystem.writeFileSync(PATH_PRIVATE_KEY, keyPair.privateKey);
            Promise.resolve();
        } catch (error: any) {
            console.error(error.message)
            throw new Error('Falha ao salvar o par de chaves de criptografia.', error.message)
        }
    }

    async getKey(type: CryptoKeyType): Promise<KeyPair> {
        if (!isAnyKeyPairExistsInPath())
            throw new Error('A chave de criptografia não existe no caminho especificado.')

        const keyPath = `${PATH_KEY_FOLDER}/${type}_key.pem`;

        try {
            let content = FileSystem.readFileSync(keyPath, 'utf8');
            let publicKey = '';
            let privateKey = '';

            if (type.includes('public')) publicKey = content;
            else privateKey = content;
            
            return new KeyPair(publicKey, privateKey)
        } catch (error: any) {
            console.error(error.message)
            throw new Error('A chave de criptografia não pode ser recuperada devido a uma falha no serviço.');
        }
    }
}