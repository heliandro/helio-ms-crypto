import Readline from 'readline';

export default interface CLIAdapterPort {
    getReadline(): Readline.Interface;
    executeQuestion(text?: string): Promise<string>;
    finish(): void;
}
