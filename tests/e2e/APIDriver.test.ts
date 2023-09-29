import { Container } from "inversify";
import { initAPIDriver } from "../../src/APIDriver";
import TYPES from '../../src/infrastructure/configuration/Types';
import HttpAdapter from "../../src/application/ports/inbound/HttpAdapter";
import axios from 'axios';
import RequestBodyDataMissingException from "../../src/infrastructure/Exceptions/RequestBodyDataMissingException";
import RequestBodyDataNoStringException from "../../src/infrastructure/Exceptions/RequestBodyDataNoStringException";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('API Driver', () => {

    let container: Container;
    let httpAdapter: HttpAdapter;

    beforeEach(async () => {
        container = initAPIDriver();
        httpAdapter = container.get<HttpAdapter>(TYPES.HttpExpressAdapter);
        await sleep(100);
    });

    afterEach(() => {
        container.unbindAll();
        httpAdapter.stopServer();
    });

    describe('Cenarios de sucesso', () => {
        it('Deve encriptar um dado', async () => {
            // Given
            const data = { name: 'John Doe' };
            const input = { data };
            // When
            const output = await axios.post('http://localhost:3000/api/v1/encrypt', input);
            // Then
            expect(output.status).toBe(200);
            expect(output.data).toHaveProperty('data');
        });
    
        it('Deve desencriptar um dado', async () => {
            // Given
            const data = { name: 'John Doe' };
            const input = { data };
            const encrypted = await axios.post('http://localhost:3000/api/v1/encrypt', input);
            // When
            const output = await axios.post('http://localhost:3000/api/v1/decrypt', encrypted.data);
            // Then
            expect(output.status).toBe(200);
            expect(output.data).toHaveProperty('data');
            expect(output.data.data).toEqual(data);
        });
    });

    describe('Cenarios de falha', () => {
        it('Deve retornar status 422 no endpoint de encrypt ao passar o body invalido', async () => {
            // Given
            const data = { name: 'John Doe' };
            const input = data;
            // When
            const output = await axios
                .post('http://localhost:3000/api/v1/encrypt', input)
                .catch((error) => error.response);
            // Then
            expect(output.status).toBe(422);
            expect(output.data.message).toBe(new RequestBodyDataMissingException().message);
        });

        it('Deve retornar status 422 no endpoint de decrypt ao passar o body invalido', async () => {
            // Given
            const data = { name: 'John Doe' };
            const input = data;
            // When
            const output = await axios
                .post('http://localhost:3000/api/v1/decrypt', input)
                .catch((error) => error.response);
            // Then
            expect(output.status).toBe(422);
            expect(output.data.message).toBe(new RequestBodyDataMissingException().message);
        });

        it('Deve retornar status 422 no endpoint de decrypt ao passar o body data diferente de string', async () => {
            // Given
            const data = { name: 'John Doe' };
            const input = { data };
            // When
            const output = await axios
                .post('http://localhost:3000/api/v1/decrypt', input)
                .catch((error) => error.response);
            // Then
            expect(output.status).toBe(422);
            expect(output.data.message).toBe(new RequestBodyDataNoStringException().message);
        });

        it('Deve retornar o status 404 ao passar uma rota invalida', async () => {
            // When
            const output = await axios
                .get('http://localhost:3000/api/v1/invalid-route')
                .catch((error) => error.response);
            // Then
            expect(output.status).toBe(404);
        });
    });
});