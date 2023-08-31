import fs from "fs"
import GenerateKeys from "@app/application/usecase/GenerateKeys"

const deleteKeyFolder = () => {
    fs.rmSync('./keys', { recursive: true, force: true })
}

test('Deve gerar as chaves de criptografia', async () => {
    // when
    const usecase = new GenerateKeys()
    // then
    deleteKeyFolder()
    const output = await usecase.execute();
    // assert
    expect(output).toStrictEqual({ 
        message: "Successful generated keys",
        success: true
    })
})