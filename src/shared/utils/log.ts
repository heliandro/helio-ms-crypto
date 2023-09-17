import { LogColor } from '../enum/LogColor.enum';

export const log = (() => {
    const error = (content: any) => console.log(`${LogColor.RED}${content}${LogColor.RESET}`);
    const success = (content: any) => console.log(`${LogColor.GREEN}${content}${LogColor.RESET}`);
    const info = (content: any) =>
        console.log(`${LogColor.BRIGHT_YELLOW}${content}${LogColor.RESET}`);
    const warn = (content: any) => console.log(`${LogColor.ORANGE}${content}${LogColor.RESET}`);

    return {
        error,
        success,
        info,
        warn
    };
})();
