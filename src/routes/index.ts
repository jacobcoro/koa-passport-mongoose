import Router from 'koa-router';
import Koa from 'koa';
import * as KoaPassport from 'koa-passport';
import local from './local';
import facebook from './facebook';
import google from './google';
import { DefaultState, Context } from 'koa';
import { ROUTES } from '../utils/config';

const routeExport = (app: Koa, passport: typeof KoaPassport) => {
    const router = new Router<DefaultState, Context>();

    router.get('/ping', async (ctx) => {
        ctx.oK(null, 'pong!');
    });
    router.get(ROUTES.VERIFY_JWT, passport.authenticate('jwt'), (ctx) => {
        ctx.oK(null, 'token verified');
    });

    local(router, passport);
    facebook(router, passport);
    google(router, passport);

    app.use(router.routes()).use(router.allowedMethods());
};

export default routeExport;
