import express from 'express';

export default interface HttpRouterAdapter {
    createRouter(): express.Router;
}