var express = require("express");
var bodyParser = require("body-parser");
var pizzasController = require("./controllers/pizzasController");

const app = express();

app.use(bodyParser.json({
  type: ["application/json"]
}));

app.get("/pizzas", pizzasController.index);

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  if (err.errors) {
    res.send({ errors: err.errors });
  } else {
    res.end();
  }
});

app.listen(3000, () => {
  console.log(`Listening at http://localhost:3000/`);
});