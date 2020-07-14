import Router from 'koa-router';
import Koa from 'koa';
import * as KoaPassport from 'koa-passport';
import password from './password';
import { DefaultState, Context } from 'koa';

const routeExport = (app: Koa, passport: typeof KoaPassport) => {
    const router = new Router<DefaultState, Context>();
    router.get('/ping', async (ctx) => {
        try {
            ctx.oK(null, 'pong!');
        } catch (error) {
            ctx.internalServerError(null, error);
        }
    });
    router.get('/verify-jwt', async (ctx) => {
        await (passport.authenticate('jwt', { session: false }),
        async (response: any) => {
            ctx.oK(null, 'token verified');
        })(ctx);
    });
    password(router, passport);

    app.use(router.routes()).use(router.allowedMethods());
};

export default routeExport;
