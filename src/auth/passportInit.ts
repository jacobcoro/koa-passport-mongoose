import User, { IUser } from '../models/user';
import session from 'koa-session';
import passport from 'koa-passport';
import password from './strategies/password';
import Koa from 'koa';

export default (app: Koa) => {
    app.use(session(app));

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user: IUser, done) {
        console.log('serializing user: ');
        console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user: IUser) {
            console.log('deserializing user:', user);
            done(err, user);
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    passport.use(password);
    app.use(passport.initialize());
    app.use(passport.session());
    return passport;
};
