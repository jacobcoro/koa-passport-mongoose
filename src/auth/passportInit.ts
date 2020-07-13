import User, { IUser } from '../models/user';
import session from 'koa-session';
import passport from 'koa-passport';
import password from './strategies/password';
import Koa from 'koa';
import { APP_SECRET } from '../utils/envsLoader';

export default (app: Koa) => {
    app.keys = [APP_SECRET];
    app.use(session(null, app));
    passport.serializeUser(function (user: IUser, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user: IUser) {
            done(err, user);
        });
    });

    // Our strategies here
    passport.use(password);

    // Boiler
    app.use(passport.initialize());
    app.use(passport.session());
    return passport;
};
