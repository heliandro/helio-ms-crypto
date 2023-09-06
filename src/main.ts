// import GenerateKeys from "./application/usecases/GenerateKeyPair";
// import CryptoRepository from '@app/domain/repositories/CryptoRepository';
// import CryptoRepositoryFileSystem from "./infrastructure/cryptoRepository/CryptoRepositoryFileSystem";

// enum DependencyName {
//     CryptoRepository = 'cryptoRepository',
//     GenerateKeys = 'generateKeys'
// }

// export type DependencyRegistry = {
//     [DependencyName.CryptoRepository]?: CryptoRepository;
//     [DependencyName.GenerateKeys]?: GenerateKeys;
// };

// class DependencyRegister {

//     private registry: DependencyRegistry = {};

//     constructor() {
//         const cryptoRepository = new CryptoRepositoryFileSystem();
//         const generateKeys = new GenerateKeys(cryptoRepository);

//         dependencyRegistry.register(DependencyName.CryptoRepository, cryptoRepository);
//         dependencyRegistry.register(DependencyName.GenerateKeys, generateKeys);
//     }

//     register(dependencyName: keyof DependencyRegistry, dependency: any) {
//         this.registry[dependencyName] = dependency;
//     }

//     getRegistry() {
//         return this.registry;
//     }
// }

// const dependencyRegistry = new DependencyRegister();
// export default dependencyRegistry