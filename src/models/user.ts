import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username?: string;
    password?: string;
    privKeyHash?: string;
    pubKey?: string;
}
/* Mongoose will complain about duplicat keys if we set any of these as unique, 
because we don't use them in all situations. Sp we should manually check if these are unique. 
*/
const UserSchema = new Schema(
    {
        username: { type: String, unique: false, required: false },
        password: { type: String, unique: false, required: false },
        privKeyHash: { type: String, unique: false, required: false },
        pubKey: { type: String, unique: false, required: false },
    },
    {
        collection: 'user',
        timestamps: true,
    },
);
export default mongoose.model<IUser>('user', UserSchema);
