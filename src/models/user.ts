import mongoose, { Schema, Document } from 'mongoose';
import * as bCrypt from 'bcrypt-nodejs';

/** @param username will be an email for local scheme, for google and facebook will be email if available or id if not */
export interface IUser extends Document {
    username: string;
    authType: 'google' | 'facebook' | 'password' | null;
    password?: string;
    privKeyHash?: string;
    pubKey?: string;
    facebook: SocialMediaAccount;
    google: SocialMediaAccount;
}
interface SocialMediaAccount {
    id?: string;
    token?: string;
    email?: string;
    givenName?: string;
    familyName?: string;
    picture?: string;
}

/* Mongoose will complain about duplicate keys if we set any of these as unique, 
because we don't use them in all situations. So we should manually check if these are unique. 
*/
const UserSchema = new Schema(
    {
        username: { type: String, unique: true, required: false },
        authType: { type: String, unique: false, required: false },
        password: { type: String, unique: false, required: false },
        privKeyHash: { type: String, unique: false, required: false },
        pubKey: { type: String, unique: false, required: false },
        google: {
            id: { type: String, unique: false, required: false },
            token: { type: String, unique: false, required: false },
            email: { type: String, unique: false, required: false },
            givenName: { type: String, unique: false, required: false },
            familyName: { type: String, unique: false, required: false },
            picture: { type: String, unique: false, required: false },
        },
        facebook: {
            id: { type: String, unique: false, required: false },
            token: { type: String, unique: false, required: false },
            email: { type: String, unique: false, required: false },
            givenName: { type: String, unique: false, required: false },
            familyName: { type: String, unique: false, required: false },
            picture: { type: String, unique: false, required: false },
        },
    },
    {
        collection: 'user',
        timestamps: true,
    },
);

export const hashPassword = (password: IUser['password']) =>
    bCrypt.hashSync(password, bCrypt.genSaltSync(10));

export const validPassword = function (
    providedPassword: string,
    storedPassword: IUser['password'],
) {
    return bCrypt.compareSync(providedPassword, storedPassword);
};
export default mongoose.model<IUser>('user', UserSchema);
