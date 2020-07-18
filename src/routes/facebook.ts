import Router from 'koa-router';
import * as KoaPassport from 'koa-passport';
import { IUser } from '../models/user';
import { DefaultState, Context } from 'koa';
import { createJwt } from '../auth/strategies/jwt';
import { ROUTES, CLIENT_CALLBACK } from '../utils/config';

import url from 'url';

const faecbook = function (router: Router<DefaultState, Context>, passport: typeof KoaPassport) {
    router.get(
        ROUTES.FACEBOOK_AUTH,
        passport.authenticate('facebook', { scope: ['public_profile', 'email'] }),
    );

    router.get(ROUTES.FACEBOOK_AUTH_CALLBACK, async (ctx, next) => {
        return passport.authenticate('facebook', (err: string, user: IUser) => {
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
export default faecbook;
