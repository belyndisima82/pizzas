const OrderRepository = require("../repositories/orderRepository");

exports.index = function(req, res) {
    OrderRepository.findAll()
      .then(function(orders) {
          res.send(orders);
      }).catch(function(error) {
          res.status(400).send(error);
      });
};

exports.post = function(req, res) {
    const body = req.body;
    if(body.address && body.items && Array.isArray(body.items) && body.items.length > 0) {
        OrderRepository.insert(body.address, body.items)
          .then(function(order) {
              res.status(201).send(order);
          }).catch(function(error) {
              console.log(error);
              res.status(400).send(error);
          });
    } else {
        res.status(400).send("bad request");
    }
};