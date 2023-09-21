
const TYPES = {
    GenerateKeyPair: Symbol.for('GenerateKeyPair'),
    Encrypt: Symbol.for('Encrypt'),
    Decrypt: Symbol.for('Decrypt'),
    GetKey: Symbol.for('GetKey'),
    CryptoFileSystemRepository: Symbol.for('CryptoFileSystemRepository'),
    FileSystemAdapter: Symbol.for('FileSystemAdapter'),
    CLIAdapter: Symbol.for('CLIAdapter'),
    HttpExpressAdapter: Symbol.for('HttpExpressAdapter'),
    HttpEncryptController: Symbol.for('HttpEncryptController'),
};

export default TYPES;
