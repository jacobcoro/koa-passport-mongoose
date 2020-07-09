import Router from 'koa-router';
import Koa from 'koa';
import * as KoaPassport from 'koa-passport';
import password from './password';
import mongoose from 'mongoose';

const routeExport = (app: Koa, passport: typeof KoaPassport, db: mongoose.Connection) => {
    const router = new Router();
    router.get('/ping', async (ctx) => {
        try {
            ctx.oK(null, 'pong!');
        } catch (error) {
            ctx.internalServerError(null, error);
        }
    });

    password(router, passport, db);

    app.use(router.routes()).use(router.allowedMethods());
};

export default routeExport;
