var ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;
var dotenv = require("dotenv");

//get config from .env
dotenv.config();

//setup OIDC
const oidc = new ExpressOIDC({
    issuer: process.env.OISSUER,
    client_id: process.env.OCLIENTID,
    client_secret: process.env.OCLIENTSECRET,
    appBaseUrl: 'http://' + process.env.HOST + ':' + process.env.PORT,
    scope: 'openid profile',
    routes: {
        login: {
            path: '/users/login'
        },
        loginCallback: {
            path: '/authorization-code/callback',
            afterCallback: '/dashboard'
        }
    }
});

module.exports = oidc;
