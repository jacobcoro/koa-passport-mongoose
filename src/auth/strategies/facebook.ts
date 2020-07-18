import { Strategy as FacebookStrategy } from 'passport-facebook';
import User, { IUser } from '../../models/user';
import { FACEBOOK_CONFIG } from '../../utils/config';

const facebookStrat = new FacebookStrategy(
    FACEBOOK_CONFIG,
    async (ctx, token, refreshToken, profile, done) => {
        console.log('===========ctx===========\n', ctx);
        console.log('===========profile===========\n', profile);
        const email = profile.emails ? profile.emails[0].value.toLowerCase() || null : null;
        const user = await User.findOne({
            username: email || profile.id,
        });
        if (user) {
            return done(null, user);
        } else {
            const newUser = new User();
            newUser.username = email || profile.id;
            newUser.facebook.id = profile.id;
            newUser.facebook.givenName = profile.name.givenName;
            newUser.facebook.familyName = profile.name.familyName;
            newUser.facebook.picture = profile.photos[0].value || null;
            newUser.facebook.token = token;
            newUser.save((err) => {
                if (err) {
                    console.log(err);
                    return done(err);
                }
                return done(null, newUser);
            });
        }
    },
);
export default facebookStrat;
