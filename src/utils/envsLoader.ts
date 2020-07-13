import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' }); // If the .env file is not just .env, you need this config

const PORT = parseInt(process.env.PORT, 10) || 3000; // needs to match ports in docker-compose file

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017'; // for dev, needs to match service name from docker-compose file

const APP_SECRET = process.env.APP_SECRET || 'secretString!%@#$@%';

export { PORT, MONGO_URI, APP_SECRET };
