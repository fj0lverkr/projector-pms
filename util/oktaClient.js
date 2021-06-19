var okta = require("@okta/okta-sdk-nodejs");
var dotenv = require("dotenv");

//get config from .env
dotenv.config();

//setup OktaClient
var oktaClient = new okta.Client({
    orgUrl: process.env.OKTAORGURL,
    token: process.env.OKTATOKEN
});

module.exports = oktaClient;
