import connectDb from './mongo/mongoose';

import koa from 'koa';
import cors from '@koa/cors';
import koaResponse from 'koa-response2';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';

import passportInit from './auth/passportInit';

import router from './routes';

import { PORT } from './utils/config';

const app = new koa();

/** Database */
const db = connectDb();

/** Middlewares */
app.use(cors());
app.use(logger());
app.use(bodyParser());
app.use(helmet());
app.use(
    koaResponse({
        format(status, payload, message = '') {
            return {
                code: status,
                data: payload,
                message,
            };
        },
    }),
);

/** Passport */
const passport = passportInit(app);

/** Routes */
router(app, passport);

/** Start the server! */
app.listen(PORT, () => console.log(`Koa server listening on PORT ${PORT}`));
