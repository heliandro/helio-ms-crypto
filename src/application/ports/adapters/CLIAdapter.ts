import Readline from 'readline';

export default interface CLIAdapter {
    getReadline(): Readline.Interface;
    executeQuestion(text?: string): Promise<string>;
    finish(): void;
}
