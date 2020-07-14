import passportJwt from 'passport-jwt';
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
import User, { IUser } from '../../models/user';
import { APP_SECRET } from '../../utils/envsLoader';

var opts = {
    secretOrKey: APP_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
const jwtStrat = new JwtStrategy(opts, async (payload: IUser, done) => {
    try {
        const user = await User.findOne({ _id: payload._id });
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        done(err, false);
    }
});
export default jwtStrat;
