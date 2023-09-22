const TYPES = {
    GenerateKeyPair: Symbol.for('GenerateKeyPair'),
    Encrypt: Symbol.for('Encrypt'),
    Decrypt: Symbol.for('Decrypt'),
    GetKey: Symbol.for('GetKey'),
    CryptoFileSystemRepository: Symbol.for('CryptoFileSystemRepository'),
    FileSystemAdapter: Symbol.for('FileSystemAdapter'),
    CLIAdapter: Symbol.for('CLIAdapter'),
    HttpExpressAdapter: Symbol.for('HttpExpressAdapter'),
    HttpHealthController: Symbol.for('HttpHealthController'),
    HttpEncryptController: Symbol.for('HttpEncryptController'),
    HttpDecryptController: Symbol.for('HttpDecryptController'),
};

export default TYPES;
