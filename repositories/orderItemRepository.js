const connection = require('../connections/mysql');
const models = require('../models');

var findById = function(id) {
    return new Promise(function(resolve, reject) {
        connection.query("SELECT oi.id oi_id, oi.price oi_price, oi.quantity oi_quantity, \
            p.id p_id, p.name p_name, p.price p_price, p.image_url p_image_url \
            FROM order_items oi \
            INNER JOIN pizzas p ON oi.pizza_id = p.id \
            WHERE oi.id = ?", [id], function(error, result) {
            if(error) {
                reject(error);
                return;
            }
            var pizza = new models.Pizza({
                id: result[0].p_id,
                name: result[0].p_name,
                price: result[0].p_price,
                image_url: result[0].p_image_url
            });
            var orderItem = new models.OrderItem({
                id: result[0].oi_id,
                price: result[0].oi_price,
                quantity: result[0].oi_quantity,
                pizza: pizza
            });
            resolve(orderItem);
        });
    });
};
var insert = function(order, pizza, quantity) {
    return new Promise(function(resolve, reject) {
        connection.query("INSERT INTO order_items VALUES (NULL, ?, ?, ?, ?)", [order.id, pizza.price, pizza.id, quantity], function(error, result) {
            if(error) {
                reject(error);
                return;
            }
            findById(result.insertId)
                .then(function(item) {
                    resolve(item);
                }).catch(function(error) {
                    reject(error);
                });
        });
    });
};

exports.findById = findById;
exports.insert = insert;