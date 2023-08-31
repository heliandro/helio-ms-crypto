import fs from 'fs'
import crypto from 'crypto'

export default class GenerateKeys {

    private PATH_KEY_FOLDER = './keys'
    private PATH_PUBLIC_KEY = `${this.PATH_KEY_FOLDER}/public_key.pem`
    private PATH_PRIVATE_KEY = `${this.PATH_KEY_FOLDER}/private_key.pem`

    constructor(){}

    async execute (): Promise<Output> {

        if (fs.existsSync(this.PATH_PUBLIC_KEY) || fs.existsSync(this.PATH_PRIVATE_KEY)) {
            return { 
                message: "Public and Private keys already exists.",
                success: true
            }
        }

        try {
            fs.mkdirSync(this.PATH_KEY_FOLDER)

            const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 1024,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                },
            });

            fs.writeFileSync(this.PATH_PUBLIC_KEY, publicKey);
            fs.writeFileSync(this.PATH_PRIVATE_KEY, privateKey);

            return { 
                message: "Successful generated keys",
                success: true
            };
        } catch (error: any) {
            console.error("GenerateKeys:: ", error);
            return { message: error.message, success: false };
        }
    }
}


type Input = {}

type Output = {
    message: string,
    success: boolean
}