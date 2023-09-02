import GenerateKeyPair from './application/usecase/GenerateKeyPair';
import EncryptionAlgorithm from './domain/value-object/EncryptionAlgorithm';
import CryptoAdapterImpl from './infra/adapters/CryptoAdapterImpl';

// driver, primary driver, input adapter
process.stdin.on("data", async function (chunk) {
    const command = chunk.toString().replace(/\n/g, "")

    if (command.startsWith("help")) {
        console.log("\nList of commands: \n");
        console.table({
            "generate-keys": "generate public and private keys",
            encrypt: "encrypt data. Ex: encrypt \"{ name: 'Heliandro' }\""
        })
    }

    if (command.startsWith("generate-keys")) {
        const encryptionAlgorithmVo = new EncryptionAlgorithm();
        const cryptoAdapter = new CryptoAdapterImpl(encryptionAlgorithmVo)
        const usecase = new GenerateKeyPair(cryptoAdapter);
        const output = await usecase.execute()
        console.log(output);
    }

    if (command.startsWith("encrypt")) {
        const data = command.replace(/encrypt\s{0,1}/, "")
        
        if (!data) {
            console.error('Data not found!')
            return;
        }

        try {
            const parsedData = JSON.parse(data)
            console.log(parsedData)
        } catch (error: any) {
            console.error("Incorrete JSON format. ", error?.message)
        }
    }

    if (command.startsWith("decrypt")) {
        console.log("TODO - decrypt data....")
    }
})