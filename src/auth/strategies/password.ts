import * as passportLocal from 'passport-local';
import User, { IUser } from '../../models/user';
import * as bCrypt from 'bcrypt-nodejs';

const LocalStrategy = passportLocal.Strategy;

const passwordStrat = new LocalStrategy(
    async (username: IUser['username'], password: IUser['password'], done) => {
        const user = await User.findOne({ username: username });
        if (!user) {
            done('User not found', false);
        } else {
            bCrypt.compare(password, user.password, (error, result) => {
                if (error) {
                    done(error, false);
                } else if (result) {
                    done(null, user);
                } else {
                    done('Password does not match', false);
                }
            });
        }
    },
);
export default passwordStrat;
