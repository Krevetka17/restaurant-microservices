const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//const { MenuItem } = require('../common/models');

mongoose.connect(
  process.env.MONGO_URI || 
  (process.env.DOCKER ? 'mongodb://mongodb:27017' : 'mongodb://localhost:27017') +
  '/menu_db'
);

const menuSchema = new mongoose.Schema({
  imageUrl: { type: String, default: null },
  name: String,
  description: String,
  price: Number,
  category: String
});

const Menu = mongoose.model('MenuItem', menuSchema);

// Тестовые данные
const seed = async () => {
  if (await Menu.countDocuments() === 0) {
    await Menu.insertMany([
      { name: "Pizza Margherita", description: "Томаты, моцарелла", price: 89, category: "food", imageUrl: "https://example.com/pizza.jpg" },
      { name: "Burger Classic", description: "Говядина 200г", price: 75, category: "food", imageUrl: "https://example.com/burger.jpg" },
      { name: "Coca-Cola 0.5л", description: "Газировка", price: 25, category: "drinks", imageUrl: "https://example.com/cocacola.jpg" },
      { name: "Tiramisu", description: "Десерт", price: 65, category: "desserts", imageUrl: "https://example.com/tiramisu.jpg" }
    ]);
    console.log("Меню заполнено");
  }
};
seed();

const app = express();
app.use(cors());
app.use(express.json());
 
app.get('/menu', async (req, res) => {
  const items = await Menu.find();
  res.json(items);
});
 
//
app.listen(5001, () => console.log("Menu Service: http://localhost:5001"));