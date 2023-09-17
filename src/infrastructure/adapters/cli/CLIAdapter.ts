import { injectable } from 'inversify';
import Readline from 'readline';
import CLIAdapterPort from '../../../application/ports/adapters/CLIAdapterPort';

@injectable()
export default class CLIAdapter implements CLIAdapterPort {
    private readline: Readline.Interface;

    constructor() {
        this.readline = Readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    getReadline(): Readline.Interface {
        return this.readline;
    }

    executeQuestion(text?: string): Promise<string> {
        return new Promise((resolve, _) => {
            this.readline.question(text ?? '> ', (choice) => {
                resolve(choice);
            });
        });
    }

    finish(): void {
        this.readline.close();
    }
}
