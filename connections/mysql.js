const mysql = require('mysql');

const config = {
    host: 'localhost',
    user: 'admin',
    password: 'R2d2C3p0_',
    database: 'pizzas',
};

const pool = mysql.createPool(config);
module.exports = pool;