import { Output } from "../usecases/GenerateKeyPair";
import CryptoRepositoryPort from "./repository/CryptoRepositoryPort";

export default interface GenerateKeyPairPort {
    readonly repository: CryptoRepositoryPort;
    execute(): Promise<Output>;
}