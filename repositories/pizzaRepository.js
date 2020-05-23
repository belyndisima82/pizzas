const connection = require('../connections/mysql');
const models = require('../models');

var findById = function(id) {
    return new Promise(function(resolve, reject) {
        connection.query("SELECT * FROM pizzas WHERE id = ?", [id], function(error, result) {
            if(error) {
                reject(error);
                return;
            }
            var pizza = new models.Pizza(result[0]);
            resolve(pizza);
        });
    });
};
var findAll = function() {
    return new Promise(function(resolve, reject) {
        connection.query("SELECT * FROM pizzas", function(error, result) {
            if(error) {
                reject(error);
                return;
            }
            var pizzas = [];
            for(i=0; i<result.length;i++) {
                pizzas.push(new models.Pizza(result[i]));
            }
            resolve(pizzas);
        });
    });
};
var insert = function(name, price, imageUrl) {
    return new Promise(function(resolve, reject) {
        connection.query("INSERT INTO pizzas VALUES (NULL, ?, ?, ?)", [name, price, imageUrl], function(error, result) {
            if(error) {
                reject(error);
                return;
            }
            findById(result.insertId)
                .then(function(pizza) {
                    resolve(pizza);
                }).catch(function(error) {
                    reject(error);
                });
        });
    });
};

exports.findAll = findAll;
exports.findById = findById;
exports.insert = insert;