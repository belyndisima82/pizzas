class Order {
    constructor(obj) {
        this.id = obj.id;
        this.date = obj.date;
        this.address = obj.address;
        this.items = [];
        this.total = 0;
    }

    addItem(item) {
        this.items.push(item);
        this.total = this.getTotal();
    }

    getTotal() {
        var total = 0;
        for(i=0; i<this.items.length; i++) {
            total += (this.items[i].price * this.items[i].quantity);
        }
        return total;
    }
}

class OrderItem {
    constructor(obj) {
        this.id = obj.id;
        this.price = obj.price;
        this.pizza = obj.pizza;
        this.quantity = obj.quantity;
    }
}

class Pizza {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.imageUrl = obj.image_url;
        this.price = obj.price;
    }
}

module.exports = {
    Pizza: Pizza,
    Order: Order,
    OrderItem: OrderItem
}