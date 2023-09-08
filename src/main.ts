import CLI from "./cli";
import DependencyInjectionConfig from "./config/DependencyInjectionConfig";

export const initCLI = () => {
    const di = DependencyInjectionConfig.createCLI();
    const cli = di.get(CLI);
    cli.start();
}
