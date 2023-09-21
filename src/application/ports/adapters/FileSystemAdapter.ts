export default interface FileSystemAdapter {
    existsFile(path: string): Promise<boolean>;
    existsDirectory(path: string): Promise<boolean>;
    createDirectoryIfNotExists(path: string): Promise<void>;
    writeFile(dirPath: string, filename: string, data: string): Promise<void>;
    readFile(dirPath: string, filename: string): Promise<string>;
}
