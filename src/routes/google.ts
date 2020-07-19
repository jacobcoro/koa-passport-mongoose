import Router from 'koa-router';
import * as KoaPassport from 'koa-passport';
import { IUser } from '../models/user';
import { DefaultState, Context } from 'koa';
import { createJwt } from '../auth/strategies/jwt';
import { ROUTES, CLIENT_CALLBACK } from '../utils/config';

import url from 'url';

const google = function (router: Router<DefaultState, Context>, passport: typeof KoaPassport) {
    router.get(
        ROUTES.GOOGLE_AUTH,
        passport.authenticate('google', { scope: ['profile', 'email'] }),
    );

    router.get(ROUTES.GOOGLE_AUTH_CALLBACK, async (ctx, next) => {
        return passport.authenticate('google', (err: string, user: IUser) => {
            // console.log('ctx.request', ctx.request);
            // console.log('user', user);
            if (err) {
                ctx.unauthorized(err, err);
            } else {
                ctx.redirect(
                    url.format({
                        pathname: ctx.request.header.referer
                            ? ctx.request.header.referer + '/'
                            : CLIENT_CALLBACK,
                        query: {
                            token: createJwt(user.username),
                            username: user.username,
                            _id: user.id,
                        },
                    }),
                );
            }
        })(ctx, next);
    });
    return router;
};
export default google;
