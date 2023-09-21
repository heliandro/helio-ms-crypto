import FileSystemAdapter from '@app/src/application/ports/adapters/FileSystemAdapter';
import { injectable } from 'inversify';
import * as fsPromises from 'node:fs/promises';

@injectable()
export default class FileSystemFSAdapter implements FileSystemAdapter {
    private fileSystem: typeof fsPromises;

    constructor() {
        this.fileSystem = fsPromises;
    }

    async existsFile(path: string): Promise<boolean> {
        try {
            const stats = await this.fileSystem.stat(path);
            return stats.isFile();
        } catch (error: any) {
            return false;
        }
    }

    async existsDirectory(path: string): Promise<boolean> {
        try {
            const stats = await this.fileSystem.stat(path);
            return stats.isDirectory();
        } catch (error: any) {
            return false;
        }
    }

    async createDirectoryIfNotExists(path: string): Promise<void> {
        const exists = await this.existsDirectory(path);
        if (!exists) {
            await this.fileSystem.mkdir(path);
        }
    }

    async writeFile(dirPath: string, filename: string, data: string): Promise<void> {
        const exists = await this.existsDirectory(dirPath);
        if (!exists) {
            throw new Error(`The directory ${dirPath} does not exists.`);
        }
        const path = `${dirPath}/${filename}`;
        await this.fileSystem.writeFile(path, data, { encoding: 'utf8', flag: 'w' });
    }

    async readFile(dirPath: string, filename: string): Promise<string> {
        const exists = await this.existsDirectory(dirPath);
        if (!exists) {
            throw new Error(`The directory ${dirPath} does not exists.`);
        }
        const path = `${dirPath}/${filename}`;
        return await this.fileSystem.readFile(path, 'utf8');
    }
}
