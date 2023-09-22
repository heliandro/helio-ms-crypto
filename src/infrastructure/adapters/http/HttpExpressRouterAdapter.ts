import express from 'express';
import { injectable } from 'inversify';

import HttpRouterAdapter from '../../../application/ports/inbound/HttpRouterAdapter';

@injectable()
export default class HttpExpressRouterAdapter implements HttpRouterAdapter {
    createRouter() {
        return express.Router();
    }
}
