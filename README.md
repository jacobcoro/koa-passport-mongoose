# koa-passport-mongoose

 A simple Node.js Koa server with password and oAuth login using passport and persisted to MongoDB
 This is probably better for serving native apps, because it uses JWT. For browser apps, storage of JWT is tricky and not safe, so a more complex solution is needed. 

 Can be hosted on Heroku with ease

## To run

change the example.env.local to .env.local

```bash
npm install
npm run build

# Make sure you have docker running on your system

# Only needs to be done once:
make setup
# Needs to run each time you add a new dependency:
make install
# Later you can just call this to start:
make dev
```

> server will be available on `localhost:<The port number you used in .env file>` eg. `localhost:3003`
