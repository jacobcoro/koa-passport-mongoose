import mongoose from 'mongoose';
import { MONGO_URI } from '../utils/envsLoader';

const connectDb = () => {
    const uri = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : MONGO_URI;
    const db = mongoose.connection;
    mongoose.connect(uri, { useNewUrlParser: true });
    db.on('error', console.error);
    db.on('connected', () => console.log('connected to mongo'));
    db.on('diconnected', () => console.log('Mongo is disconnected'));
    db.on('open', () => console.log('Connection Made!'));
    return db;
};
export default connectDb;
