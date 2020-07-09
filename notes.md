## steps

1. Set up basic koa passport server based on [this](https://github.com/rkusa/koa-passport-example)
2. Add tests with Jest, add edge cases and bad inputs
3. Add MongoDB
4. Add nice response messages [response library usage](https://github.com/Army-U/koa-response2), built off [this](https://github.com/jeffijoe/koa-respond)
5. Add validation [validation library openapi-validator-middleware](https://github.com/PayU/openapi-validator-middleware) Input validation using Swagger (Open API) and ajv
6. Add facebook, github, google

then the dApp stuff:

1. New user from facebook etc. creates libp2p ID. Create Thread on user's behalf, using ID to sign. Send userAuth object to client. Login with password also sends back userAuth
2. New user from password same as above but privKey is encrypted with password
3. Crypto wallets just save pubKey server side. Client side handle signiture. Server needs a signiture challenge API.

current routes autoloading thing might be overkill. list out all the routes in a file, but abstract some of the inner workings.

4. build integration with buckets. host frontend on IPFS.

[koa-passport gotcha](https://stackoverflow.com/questions/57128108/koa-passport-authentication-always-returns-4xx):
When using koa-passport you must be sure to both return the result of the authentication, and call authenticate with the context.

``` js
return passport.authenticate( 'local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
} )( ctx );
```

If you got at least one of below things when making google sign in...

1. Failed to retrieve user profile Legacy People API has not been used in project... (in console)
2. Failed to obtain access token invalid_grant... (in console)
3. Internal server error (on browser)
[gotcha 2](https://github.com/rkusa/koa-passport-example/issues/30)
I recommend you change dependency module "passport-google-auth" to "passport-google-oauth".
Then modify parts that the module used like this.
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
and follow here http://www.passportjs.org/docs/google/


### response reference:

| name                          | code |
|-------------------------------|------|
| oK                            | 200  |
| created                       | 201  |
| accepted                      | 202  |
| nonAuthoritativeInformation   | 203  |
| partialContent                | 206  |
| multipleChoices               | 300  |
| badRequest                    | 400  |
| unauthorized                  | 401  |
| paymentRequired               | 402  |
| forbidden                     | 403  |
| notFound                      | 404  |
| methodNotAllowed              | 405  |
| notAcceptable                 | 406  |
| requestTimeout                | 408  |
| conflict                      | 409  |
| gone                          | 410  |
| lengthRequired                | 411  |
| preconditionFailed            | 412  |
| payloadTooLarge               | 413  |
| requestURITooLong             | 414  |
| unsupportedMediaType          | 415  |
| requestedRangeNotSatisfiable  | 416  |
| expectationFailed             | 417  |
| imATeapot                     | 418  |
| misdirectedRequest            | 421  |
| unprocessableEntity           | 422  |
| locked                        | 423  |
| failedDependency              | 424  |
| upgradeRequired               | 426  |
| preconditionRequired          | 428  |
| tooManyRequests               | 429  |
| requestHeaderFieldsTooLarge   | 431  |
| unavailableForLegalReasons    | 451  |
| internalServerError           | 500  |
| notImplemented                | 501  |
| badGateway                    | 502  |
| serviceUnavailable            | 503  |
| gatewayTimeout                | 504  |
| hTTPVersionNotSupported       | 505  |
| variantAlsoNegotiates         | 506  |
| insufficientStorage           | 507  |
| loopDetected                  | 508  |
| notExtended                   | 510  |
| networkAuthenticationRequired | 511  |
| networkConnectTimeoutError    | 599  |


remove mongo db or collection with 
```js
    /* Drop the DB */
mongoose.connection.db.dropDatabase();
   /* Drop a collection */
mongoose.connection.collections['user'].drop(function (err) {
    console.log('collection dropped');
});
```