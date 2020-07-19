import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../../models/user';
import { GOOGLE_CONFIG } from '../../utils/config';

const googleStrat = new GoogleStrategy(
    GOOGLE_CONFIG,
    async (ctx, token, refreshToken, profile, done) => {
        const email = profile.emails ? profile.emails[0].value.toLowerCase() || null : null;

        const user = await User.findOne({
            username: email || profile.id,
        });
        // console.log('user', user);
        if (user) {
            return done(null, user);
        } else {
            const newUser = new User();
            newUser.username = email || profile.id;
            newUser.google.id = profile.id;
            newUser.google.givenName = profile.name.givenName;
            newUser.google.familyName = profile.name.familyName;
            newUser.google.picture = profile.photos[0].value || null;
            newUser.google.token = token;
            newUser.save((err) => {
                if (err) {
                    return done(err);
                }
                return done(null, newUser);
            });
        }
    },
);
export default googleStrat;
