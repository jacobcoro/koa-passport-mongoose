import Router from 'koa-router';
import * as KoaPassport from 'koa-passport';
import User, { IUser } from '../models/user';
import mongoose from 'mongoose';
import * as bCrypt from 'bcrypt-nodejs';
import { Passport } from 'koa-passport';

const password = function (router: Router, passport: typeof KoaPassport, db: mongoose.Connection) {
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
            ctx.oK(newUser, 'New user created');
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

                ctx.oK(null, 'Login successful');
            }
        })(ctx, next);
    });
    return router;
};
export default password;
