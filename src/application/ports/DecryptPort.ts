import { Input, Output } from "../usecases/Decrypt";
import CryptoRepositoryPort from "./repository/CryptoRepositoryPort";

export default interface DecryptPort {
    readonly repository: CryptoRepositoryPort;
    execute(input: Input): Promise<Output>;
}