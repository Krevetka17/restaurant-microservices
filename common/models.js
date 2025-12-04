// common/models.js
class User {
  constructor(id, name, email, isAdmin = false) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.isAdmin = isAdmin;
  }
}

class MenuItem {
  constructor(id, name, description, price, category) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
  }
}

class Order {
  constructor(id, userId, items, total, tableNumber, status = "new", createdAt = new Date()) {
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.total = total;
    this.tableNumber = tableNumber;
    this.status = status;
    this.createdAt = createdAt;
  }
}

module.exports = { User, MenuItem, Order };