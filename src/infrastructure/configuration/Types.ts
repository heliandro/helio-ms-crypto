const TYPES = {
    GenerateKeyPairUsecase: Symbol.for('GenerateKeyPairUsecase'),
    EncryptUsecase: Symbol.for('EncryptUsecase'),
    DecryptUsecase: Symbol.for('DecryptUsecase'),
    GetKeyUsecase: Symbol.for('GetKeyUsecase'),
    CryptoFileSystemRepository: Symbol.for('CryptoFileSystemRepository'),
    FileSystemAdapter: Symbol.for('FileSystemAdapter'),
    CLIAdapter: Symbol.for('CLIAdapter'),
    HttpExpressAdapter: Symbol.for('HttpExpressAdapter'),
    HttpExpressRouterAdapter: Symbol.for('HttpExpressRouterAdapter'),
    HttpHealthController: Symbol.for('HttpHealthController'),
    HttpEncryptController: Symbol.for('HttpEncryptController'),
    HttpDecryptController: Symbol.for('HttpDecryptController')
};

export default TYPES;
