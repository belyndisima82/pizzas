const connection = require('../connections/mysql');

exports.index = function(req, res) {
    connection.query("SELECT * FROM pizzas", function(error, result) {
        if(error) throw error;

        res.send(result);
    });
};