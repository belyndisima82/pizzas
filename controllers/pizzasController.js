const PizzaRepository = require("../repositories/pizzaRepository");

exports.index = function(req, res) {
    PizzaRepository.findAll()
      .then(function(pizzas) {
          res.send(pizzas);
      }).catch(function(error) {
          res.status(400).send(error);
      });
};

exports.post = function(req, res) {
    const body = req.body;
    if(body.name && body.price && body.image_url) {
        const name = body.name;
        const price = parseFloat(body.price);
        const imageUrl = body.image_url;
        PizzaRepository.insert(name, price, imageUrl)
          .then(function(pizza) {
              res.status(201).send(pizza);
          }).catch(function(error) {
              res.status(400).send(error);
          });
    } else {
        res.status(400).send("bad request");
    }
};