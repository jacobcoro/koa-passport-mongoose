import dotenv from 'dotenv';
import { StrategyOptionsWithRequest } from 'passport-google-oauth20';
import { StrategyOptionWithRequest } from 'passport-facebook';
import passportJwt from 'passport-jwt';
const ExtractJwt = passportJwt.ExtractJwt;

dotenv.config({ path: './.env.local' }); // If the .env file is not just .env, you need this config

/** needs to match ports in docker-compose file */
const PORT = parseInt(process.env.PORT, 10) || 3000;
/** for dev, needs to match service name from docker-compose file. if hosting on heroku MONGO_URI will be an env, if not you need to manually create one*/
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017';
const ROOT_URL = process.env.NODE_ENV === 'production' ? process.env.ROOT_URL : 'localhost:' + PORT;
const APP_SECRET = process.env.APP_SECRET || 'secretString!%@#$@%';
/** expressed in seconds or a string describing a time span zeit/ms. Eg: 60, "2 days", "10h", "7d" */
const JWT_EXPIRY = '1h';
const JWT_OPTIONS = {
    secretOrKey: APP_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
/** Sometimes the callback cannot find the referer, In a real setup, we might need apps that use this backend to register a callback */
const CLIENT_CALLBACK =
    process.env.NODE_ENV === 'production'
        ? 'https://optimistic-torvalds-74fc0d.netlify.app'
        : 'http://localhost:8080/login/';

const ROUTES = {
    FACEBOOK_AUTH: '/auth/facebook',
    FACEBOOK_AUTH_CALLBACK: '/auth/facebook/callback',
    GOOGLE_AUTH: '/auth/google',
    GOOGLE_AUTH_CALLBACK: '/auth/google/callback',
    LOCAL_SIGNUP: '/auth/local-signup',
    LOCAL_LOGIN: '/auth/local-login',
    VERIFY_JWT: '/verify-jwt',
};

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CONFIG = {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: ROUTES.GOOGLE_AUTH_CALLBACK,
    passReqToCallback: true,
} as StrategyOptionsWithRequest;

const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
const FACEBOOK_CONFIG = {
    clientID: FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET,
    callbackURL: ROUTES.FACEBOOK_AUTH_CALLBACK,
    profileFields: ['id', 'email', 'name', 'photos'],
    display: 'popup',
    passReqToCallback: true,
} as StrategyOptionWithRequest;

export {
    PORT,
    MONGO_URI,
    ROOT_URL,
    APP_SECRET,
    JWT_EXPIRY,
    JWT_OPTIONS,
    ROUTES,
    GOOGLE_CONFIG,
    FACEBOOK_CONFIG,
    CLIENT_CALLBACK,
};
