var mysql = require('mysql');
var dotenv = require('dotenv');

//get config form .env
dotenv.config();

//setup MySQL connection
var connection = mysql.createConnection({
    host: process.env.DBHOST || 'localhost',
    port: process.env.DBPORT || '3309',
    user: process.env.DBLOGIN || 'root',
    password: process.env.DBPASSWD || 'root',
    database: process.env.DBNAME || 'projector_dev'
});

module.exports = connection;
