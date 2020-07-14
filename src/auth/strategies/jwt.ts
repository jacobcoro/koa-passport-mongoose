import passportJwt from 'passport-jwt';
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
import User from '../../models/user';
import { APP_SECRET } from '../../utils/envsLoader';

var opts = {
    secretOrKey: APP_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
const jwtStrat = new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const exp = new Date(jwt_payload.exp * 1000);
        const now = new Date();
        const valid = now < exp;
        const user = await User.findOne({ _id: jwt_payload.data._id });
        if (user && valid) {
            return done(null, user);
        } else {
            return done('invalid token', false);
        }
    } catch (err) {
        console.log('err', err);
        done(err, false);
    }
});
export default jwtStrat;
