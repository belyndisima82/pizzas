const mysql = require('mysql');

const config = {
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'b636f85a17ad86',
    password: '1f365401@',
    database: 'heroku_ebd610116a92916',
};

const pool = mysql.createPool(config);
module.exports = pool;