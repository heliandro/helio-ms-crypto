const TYPES = {
    GenerateKeyPair: Symbol.for('GenerateKeyPair'),
    Encrypt: Symbol.for('Encrypt'),
    Decrypt: Symbol.for('Decrypt'),
    GetKey: Symbol.for('GetKey'),
    CryptoFileSystemRepository: Symbol.for('CryptoFileSystemRepository'),
    CLIAdapter: Symbol.for('CLIAdapter'),
    FileSystemAdapter: Symbol.for('FileSystemAdapter')
};

export default TYPES;
