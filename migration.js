const connection = require('./connections/mysql');

connection.query("\
  CREATE TABLE `pizzas` ( \
    `id` int NOT NULL AUTO_INCREMENT, \
    `name` varchar(255) NOT NULL, \
    `price` float NOT NULL, \
    `image_url` varchar(255) NOT NULL, \
    PRIMARY KEY (`id`), \
    UNIQUE KEY `name` (`name`) \
  )", function(err, res) {
    console.error(err);
    connection.query("\
      CREATE TABLE `orders` ( \
        `id` int NOT NULL AUTO_INCREMENT, \
        `date` timestamp NOT NULL, \
        `address` varchar(255) NOT NULL, \
        PRIMARY KEY (`id`) \
      )", function(err, res) {
        console.error(err);
        connection.query("\
          CREATE TABLE `order_items` ( \
            `id` int NOT NULL AUTO_INCREMENT, \
            `order_id` int NOT NULL, \
            `price` float NOT NULL, \
            `pizza_id` int NOT NULL, \
            `quantity` int NOT NULL, \
            PRIMARY KEY (`id`), \
            KEY `order_id` (`order_id`), \
            KEY `pizza_id` (`pizza_id`), \
            CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`), \
            CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`pizza_id`) REFERENCES `pizzas` (`id`) \
          )", function(err, res) {
            console.error(err);
        });
    });
});