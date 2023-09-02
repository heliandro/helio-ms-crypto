import GetKey from "@app/application/usecase/GetKey"
import KeyPair from "@app/domain/entity/KeyPair";
import CryptoRepository from "@app/domain/repository/CryptoRepository";
import CryptoRepositoryFileSystem from "@app/infra/repository/CryptoRepositoryFileSystem"

const MOCK_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMtGwYY7SGY+NUn3SokNA01ZYs
hGFzRX/H6i4zG9ralmruEZRlqziU7LLiAoUrX9g+VMKz9yzSsNumZv0Cr10EgbKS
tB31xbTd7udUrGol3Y5IUZjj5IWc3rRJ/31BAE+GXAQ7Y7iyQJbTGoVLN9Ef6zK/
BEUmX4a0yg8d14/2IQIDAQAB
-----END PUBLIC KEY-----
`;

test('Deve recuperar a chave de criptografia publica', async () => {
    // Given
    const repository: CryptoRepository = {
        save: async () => {},
        getKey: async () => new KeyPair(MOCK_PUBLIC_KEY, '')
    };
    const usecase = new GetKey(repository)
    // When
    const result = await usecase.execute({ keyType: 'public' })
    // Then
    expect(result.publicKey).toBe(MOCK_PUBLIC_KEY)
})