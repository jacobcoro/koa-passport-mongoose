import passportJwt from 'passport-jwt';
const JwtStrategy = passportJwt.Strategy;
import User, { IUser } from '../../models/user';
import { APP_SECRET, JWT_EXPIRY, JWT_OPTIONS } from '../../utils/config';
import jwt from 'jsonwebtoken';

export const createJwt = (username: IUser['username']) =>
    jwt.sign({ data: { username: username } }, APP_SECRET, { expiresIn: JWT_EXPIRY });

const jwtStrat = new JwtStrategy(JWT_OPTIONS, async (jwt_payload, done) => {
    try {
        const exp = new Date(jwt_payload.exp * 1000);
        const now = new Date();
        const valid = now < exp;
        const user = await User.findOne({ username: jwt_payload.data.username });
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
