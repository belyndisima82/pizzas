const connection = require('../connections/mysql');
const models = require('../models');
const PizzaRepository = require("./pizzaRepository");
const OrderItemRepository = require("./orderItemRepository");

var findById = function(id) {
    return new Promise(function(resolve, reject) {
        connection.query("SELECT o.id o_id, o.date o_date, o.address o_address, \
            oi.id oi_id, oi.price oi_price, oi.quantity oi_quantity, \
            p.id p_id, p.name p_name, p.price p_price, p.image_url p_image_url \
            FROM orders o \
            LEFT JOIN order_items oi ON oi.order_id = o.id \
            LEFT JOIN pizzas p ON oi.pizza_id = p.id \
            WHERE o.id = ?", [id], function(error, result) {
            if(error) {
                reject(error);
                return;
            }
            var order;
            for(i=0; i<result.length; i++) {
                if(!order) {
                    order = new models.Order({
                        id: result[i].o_id,
                        date: new Date(result[i].o_date),
                        address: result[i].o_address
                    });
                }
                if(result[i].oi_id) {
                    var pizza = new models.Pizza({
                        id: result[i].p_id,
                        name: result[i].p_name,
                        price: result[i].p_price,
                        image_url: result[i].p_image_url
                    });
                    order.addItem(new models.OrderItem({
                        id: result[i].oi_id,
                        price: result[i].oi_price,
                        quantity: oi_quantity,
                        pizza: pizza
                    }));
                }
            }
            resolve(order);
        });
    });
};
var findAll = function() {
    return new Promise(function(resolve, reject) {
        connection.query("SELECT o.id o_id, o.date o_date, o.address o_address, \
            oi.id oi_id, oi.price oi_price, oi.quantity oi_quantity, \
            p.id p_id, p.name p_name, p.price p_price, p.image_url p_image_url \
            FROM orders o \
            INNER JOIN order_items oi ON oi.order_id = o.id \
            INNER JOIN pizzas p ON oi.pizza_id = p.id", 
            function(error, result) {
            if(error) {
                reject(error);
                return;
            }
            var orders = {};
            for(i=0; i<result.length; i++) {
                if(!(result[i].o_id in orders)) {
                    orders[result[i].o_id] = new models.Order({
                        id: result[i].o_id,
                        date: new Date(result[i].o_date),
                        address: result[i].o_address
                    });
                }
                var pizza = new models.Pizza({
                    id: result[i].p_id,
                    name: result[i].p_name,
                    price: result[i].p_price,
                    image_url: result[i].p_image_url
                });
                orders[result[i].o_id].addItem(new models.OrderItem({
                    id: result[i].oi_id,
                    price: result[i].oi_price,
                    quantity: result[i].oi_quantity,
                    pizza: pizza
                }));
            }
            resolve(Object.keys(orders).map(function(key){
                return orders[key];
            }));
        });
    });
};
var insertItems = function(order, items, index) {
    return new Promise(function(resolve, reject) {
        PizzaRepository.findById(items[index].pizza_id)
        .then(function(pizza) {
            OrderItemRepository.insert(order, pizza, items[index].quantity)
                .then(function(orderItem) {
                    order.addItem(orderItem);
                    index++;
                    if(index == items.length) {
                        resolve(order);
                        return;
                    }
                    insertItems(order, items, index)
                      .then(function(order) {
                          resolve(order);
                      }).catch(function(error) {
                          reject(error);
                      });
                }).catch(function(error) {
                    reject(error);
                });
        }).catch(function(error) {
            reject(error);
        });
    });
};
var insert = function(address, items) {
    return new Promise(function(resolve, reject) {
        connection.query('INSERT INTO orders VALUES (NULL, ?, ?)', [new Date(), address], function(err, result) {
            if (err) {
                reject(error);
                return;
            } else {
                findById(result.insertId)
                  .then(function(order) {
                      insertItems(order, items, 0)
                        .then(function(order) {
                            resolve(order);
                        }).catch(function(error) {
                            reject(error);
                      });
                  }).catch(function(error) {
                      reject(error);
                  });
            }    
        });
    });
};

exports.findAll = findAll;
exports.findById = findById;
exports.insert = insert;