import Router from 'koa-router';
import * as KoaPassport from 'koa-passport';
import User, { IUser } from '../models/user';
import * as bCrypt from 'bcrypt-nodejs';
import { DefaultState, Context } from 'koa';

import { PasswordRes } from '../types';
const password = function (router: Router<DefaultState, Context>, passport: typeof KoaPassport) {
    router.post('/password/signup', async (ctx) => {
        try {
            console.log('ctx.request.body', ctx.request.body);
            const username = ctx.request.body.username;
            const password = ctx.request.body.password;
            const previousUser = await User.findOne({ username: username });
            if (previousUser) {
                ctx.notAcceptable(null, 'user already exists');
                return;
            }
            const hashedPw = bCrypt.hashSync(password, bCrypt.genSaltSync(10));
            await User.create({ username: username, password: hashedPw });
            const newUser = await User.findOne({ username: username });
            console.log('newUser', newUser);
            ctx.oK(
                { username: newUser.username, _id: newUser.id } as PasswordRes,
                'New user created',
            );
            ctx.logIn(newUser);
        } catch (err) {
            console.log(err);
            ctx.internalServerError(err, err.toString());
        }
    });
    router.post('/password/login', async (ctx, next) => {
        console.log('recieved');
        return passport.authenticate('local', (err: string, user: IUser) => {
            if (err) {
                ctx.unauthorized(err, err);
            } else {
                console.log('User', user);
                ctx.oK(
                    { username: user.username, _id: user.id } as PasswordRes,
                    'Login successful',
                );
            }
        })(ctx, next);
    });
    return router;
};
export default password;
