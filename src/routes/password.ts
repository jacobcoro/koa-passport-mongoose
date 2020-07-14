import Router from 'koa-router';
import * as KoaPassport from 'koa-passport';
import User, { IUser } from '../models/user';
import * as bCrypt from 'bcrypt-nodejs';
import { DefaultState, Context } from 'koa';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../utils/envsLoader';

import { PasswordRes } from '../types';
const password = function (router: Router<DefaultState, Context>, passport: typeof KoaPassport) {
    router.post('/password/signup', async (ctx) => {
        try {
            const username = ctx.request.body.username;
            const password = ctx.request.body.password;
            const previousUser = await User.findOne({ username: username });
            if (previousUser) {
                ctx.send(406, { error: 'user already exists' }, 'user already exists');
                return;
            }
            const hashedPw = bCrypt.hashSync(password, bCrypt.genSaltSync(10));
            await User.create({ username: username, password: hashedPw });
            const newUser = await User.findOne({ username: username });
            const token = jwt.sign(
                {
                    data: { username: newUser.username, _id: newUser.id },
                },
                APP_SECRET,
                { expiresIn: '1h' },
            );
            ctx.oK(
                { token: token, username: newUser.username, _id: newUser.id } as PasswordRes,
                'New user created',
            );
        } catch (err) {
            console.log(err);
            ctx.internalServerError(err, err.toString());
        }
    });
    router.post('/password/login', async (ctx, next) => {
        return passport.authenticate('local', (err: string, user: IUser) => {
            if (err) {
                ctx.unauthorized(err, err);
            } else {
                const token = jwt.sign(
                    {
                        data: { username: user.username, _id: user.id },
                    },
                    APP_SECRET,
                    { expiresIn: '1h' },
                );
                ctx.oK(
                    { token: token, username: user.username, _id: user.id } as PasswordRes,
                    'Login successful',
                );
            }
        })(ctx, next);
    });
    return router;
};
export default password;
