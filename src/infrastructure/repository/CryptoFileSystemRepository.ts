import { inject, injectable } from 'inversify';

import KeyPair from '../../domain/entities/KeyPair';
import CryptoRepository from '../../application/ports/outbound/CryptoRepository';
import CryptoKeyType from '../../domain/types/CryptoKeyType';
import TYPES from '../configuration/Types';
import FileSystemAdapter from '../../application/ports/outbound/FileSystemAdapter';

@injectable()
export default class CryptoFileSystemRepository implements CryptoRepository {
    private PATH_FOLDER = './keys';
    private PUBLIC_KEY_FILENAME = 'public_key.pem';
    private PRIVATE_KEY_FILENAME = 'private_key.pem';
    private PATH_PUBLIC_KEY = `${this.PATH_FOLDER}/${this.PUBLIC_KEY_FILENAME}`;
    private PATH_PRIVATE_KEY = `${this.PATH_FOLDER}/${this.PRIVATE_KEY_FILENAME}`;

    constructor(
        @inject(TYPES.FileSystemAdapter) private readonly fileSystemAdapter: FileSystemAdapter
    ) {}

    private async isKeyPairExists(): Promise<boolean> {
        const publicKeyExists = await this.fileSystemAdapter.existsFile(this.PATH_PUBLIC_KEY);
        const privateKeyExists = await this.fileSystemAdapter.existsFile(this.PATH_PRIVATE_KEY);
        return publicKeyExists && privateKeyExists;
    }

    private async validateIfKeyPairExists(): Promise<void> {
        const exists = await this.isKeyPairExists();
        if (exists) return;
        throw new Error('A chave de criptografia não existe no caminho especificado.');
    }

    private async validateIfKeyPairNotExists(): Promise<void> {
        const exists = await this.isKeyPairExists();
        if (!exists) return;
        throw new Error('O par de chaves de criptografia já existe no caminho especificado.');
    }

    async save(keyPair: KeyPair): Promise<void> {
        await this.validateIfKeyPairNotExists();

        try {
            await this.fileSystemAdapter.createDirectoryIfNotExists(this.PATH_FOLDER);
            await this.fileSystemAdapter.writeFile(
                this.PATH_FOLDER,
                this.PUBLIC_KEY_FILENAME,
                keyPair.publicKey
            );
            await this.fileSystemAdapter.writeFile(
                this.PATH_FOLDER,
                this.PRIVATE_KEY_FILENAME,
                keyPair.privateKey
            );
        } catch (error: any) {
            console.error(error.message);
            throw new Error('Falha ao salvar o par de chaves de criptografia.', error.message);
        }
    }

    async getKey(type: CryptoKeyType): Promise<KeyPair> {
        await this.validateIfKeyPairExists();

        const filename = `${type}_key.pem`;

        try {
            let content = await this.fileSystemAdapter.readFile(this.PATH_FOLDER, filename);
            let publicKey = '';
            let privateKey = '';

            if (type.includes('public')) publicKey = content;
            else privateKey = content;

            return new KeyPair(publicKey, privateKey);
        } catch (error: any) {
            console.error(error.message);
            throw new Error(
                'A chave de criptografia não pode ser recuperada devido a uma falha no serviço.'
            );
        }
    }
}
