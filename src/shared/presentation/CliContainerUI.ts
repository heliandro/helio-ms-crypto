import { inject, injectable } from 'inversify';
import "reflect-metadata";

import Readline from "node:readline"
import { HeaderComponentUI } from "./HeaderComponentUI"
import { MenuComponentUI } from "./MenuComponentUI"
import { log } from "../utils/log"
import { LogColor } from "../enum/LogColor.enum"

@injectable()
export default class CliContainerUI {

    constructor(
        @inject(Readline.Interface) readonly readline: Readline.Interface
    ) {}
    
    start() {
        HeaderComponentUI();
        MenuComponentUI();
    }
    
    async showMenuAndChooseAnOption(showHeaderUI: boolean = true): Promise<string> {
        if (showHeaderUI) 
            MenuComponentUI();

        return new Promise((resolve, reject) => {
            this.readline.question('> ', (choice) => {
                resolve(choice);
            })
        });
    }

    finish() { 
        const message = 'Encerrando o CLI. Até a proxima!'
        console.log(`\n${LogColor.MAGENTA}${message}${LogColor.RESET}\n`);

        this.readline.close();
    }

    async continueAndChooseAnOption (showHeaderUI: boolean = true): Promise<string> {
        if (showHeaderUI)
            log.warn('\nDeseja continuar? digite: "s" ou "n"')
        
        return new Promise((resolve, reject) => {
            this.readline.question('> ', (choice) => {
                resolve(choice);
            })
        });
    }
}