import CLI from "./cli";
import DependencyInjection from "./infrastructure/configuration/DependencyInjection";

export const initCLI = () => {
    const di = DependencyInjection.createCLI();
    const cli = di.get(CLI);
    cli.start();
}
