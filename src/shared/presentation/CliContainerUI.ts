import Readline from "node:readline"
import { HeaderComponentUI } from "./HeaderComponentUI"
import { MenuComponent } from "./MenuComponentUI"
import { log } from "../utils/function/log"
import { LogColor } from "../utils/enum/LogColor.enum"

export class CliContainerUI {

    constructor(readonly readline: Readline.Interface) {}
    
    start() {
        HeaderComponentUI();
        MenuComponent();
    }
    
    async showMenuAndChooseAnOption(showHeaderUI: boolean = true): Promise<string> {
        if (showHeaderUI) 
            MenuComponent();

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