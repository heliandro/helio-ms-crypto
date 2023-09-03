import GenerateKeyPair from '@app/application/usecase/GenerateKeyPair';
import GetKey from '@app/application/usecase/GetKey';
import CryptoRepositoryFileSystem from '@app/infra/repository/CryptoRepositoryFileSystem';

// driver, primary driver, input adapter
process.stdin.on("data", async function (chunk) {
    const command = chunk.toString().replace(/\n/g, "")

    if (command.startsWith("help")) {
        console.log("\nList of commands: \n");
        console.table({
            "generate-keys": "generate public and private keys. Exec: > generate-keys",
            "get-key": "get public or private key. Exec: > get-key public",
            // encrypt: "encrypt data. Exec: > encrypt \"{ name: 'Heliandro' }\""
        })
    }

    if (command.startsWith("generate-keys")) {
        const repository = new CryptoRepositoryFileSystem();
        const usecase = new GenerateKeyPair(repository);
        const output = await usecase.execute()
        console.log(output);
    }

    if (command.startsWith("get-key")) {
        const data: KeyType = <KeyType>command.replace(/get-key\s{0,1}/, "")
        const input: { keyType: KeyType } = { keyType: data }

        const repository = new CryptoRepositoryFileSystem();
        const usecase = new GetKey(repository);
        const output = await usecase.execute(input)
        console.log(output);
    }

    // if (command.startsWith("encrypt")) {
    //     const data = command.replace(/encrypt\s{0,1}/, "")
        
    //     if (!data) {
    //         console.error('Data not found!')
    //         return;
    //     }

    //     try {
    //         const parsedData = JSON.parse(data)
    //         console.log(parsedData)
    //     } catch (error: any) {
    //         console.error("Incorrete JSON format. ", error?.message)
    //     }
    // }

    // if (command.startsWith("decrypt")) {
    //     console.log("TODO - decrypt data....")
    // }
})