import Router from 'koa-router';
import * as KoaPassport from 'koa-passport';
import User, { IUser, hashPassword } from '../models/user';
import { DefaultState, Context } from 'koa';
import { createJwt } from '../auth/strategies/jwt';
import { PasswordRes } from '../types';
import { ROUTES } from '../utils/config';

const password = function (router: Router<DefaultState, Context>, passport: typeof KoaPassport) {
    router.post(ROUTES.LOCAL_SIGNUP, async (ctx) => {
        try {
            const username = ctx.request.body.username;
            const previousUser = await User.findOne({ username: username });
            if (previousUser) {
                ctx.send(406, { error: 'user already exists' }, 'user already exists');
                return;
            }
            const newUser = new User();
            newUser.username = username;
            newUser.password = hashPassword(ctx.request.body.password);
            newUser.save();
            ctx.oK(
                {
                    token: createJwt(username),
                    username: newUser.username,
                    _id: newUser.id,
                } as PasswordRes,
                'New user created',
            );
        } catch (err) {
            console.log(err);
            ctx.internalServerError(err, err.toString());
        }
    });
    router.post(ROUTES.LOCAL_LOGIN, async (ctx, next) => {
        return passport.authenticate('local', (err: string, user: IUser) => {
            if (err) {
                ctx.unauthorized(err, err);
            } else {
                ctx.oK(
                    {
                        token: createJwt(user.username),
                        username: user.username,
                        _id: user.id,
                    } as PasswordRes,
                    'Login successful',
                );
            }
        })(ctx, next);
    });
    return router;
};
export default password;
