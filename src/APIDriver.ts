import Express from 'express';
import cors from 'cors';
import DependencyInjectionConfig from './infrastructure/configuration/DependencyInjection';
import Encrypt from './application/usecases/Encrypt';
import { Container } from 'inversify';
import GenerateKeyPair from './application/usecases/GenerateKeyPair';
import Decrypt from './application/usecases/Decrypt';

interface CustomRequest extends Express.Request {
    container: Container;
}

class Application {
    private static app: Express.Application;
    private static container: Container;

    static init() {
        this.configureExpress();
        this.injectDependencies();
        this.generateCryptoKeyPair();
        return this;
    }

    private static configureExpress() {
        this.app = Express();
        this.app.use(Express.json());
        this.app.use(cors());
        return this;
    }

    private static injectDependencies() {
        this.container = DependencyInjectionConfig.create();
        this.app.use((req: CustomRequest, res: any, next: any) => {
            req.container = this.container;
            next();
        });
    }

    private static async generateCryptoKeyPair() {
        console.log('Generando chaves de criptografia...');
        const usecase = this.container.get(GenerateKeyPair);
        try {
            await usecase.execute();
        } catch (error: any) {
            console.log(error.message);
        }
    }

    static registerRouter(apiPath: string, router: Express.Router) {
        this.app.use(apiPath, router);
        return this;
    }

    static runServer() {
        this.app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    }
}

const cryptoRouter = Express.Router();
cryptoRouter.post('/encrypt', async (req: CustomRequest, res: any) => {
    let { data } = req.body;

    if (typeof data !== 'string') data = JSON.stringify(data);

    const usecase = req.container.get(Encrypt);
    const encryptedData = await usecase.execute({ data });

    res.json(encryptedData);
});

cryptoRouter.post('/decrypt', async (req: CustomRequest, res: any) => {
    let { data } = req.body;

    if (typeof data !== 'string') res.status(400).json({ message: 'Invalid data.' });

    const usecase = req.container.get(Decrypt);
    const decryptedData = await usecase.execute({ data });

    res.json(decryptedData);
});

const healthRouter = Express.Router();
healthRouter.get('/health', (req: Express.Request, res: any) => {
    res.json({ message: 'OK' });
});

Application.init()
    .registerRouter('', healthRouter)
    .registerRouter('/api', cryptoRouter)
    .runServer();
