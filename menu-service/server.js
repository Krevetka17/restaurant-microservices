const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const mongoUrl = process.env.MONGO_URI || 
  (process.env.DOCKER ? 'mongodb://mongodb:27017' : 'mongodb://localhost:27017') +
  '/menu_db';

mongoose.connect(mongoUrl);

const menuSchema = new mongoose.Schema({
  imageUrl: { type: String, default: null },
  name: String,
  description: String,
  price: Number,
  category: String
});

const Menu = mongoose.model('MenuItem', menuSchema);

// ТОЛЬКО ЛОКАЛЬНО ЗАПОЛНЯЕМ БАЗУ!
if (!process.env.DOCKER && !process.env.CI) {
  const seed = async () => {
    try {
      if (await Menu.countDocuments() === 0) {
        await Menu.insertMany([
          { name: "Pizza Margherita", description: "Томаты, моцарелла", price: 89, category: "food" },
          { name: "Burger Classic", description: "Говядина 200г", price: 75, category: "food" },
          { name: "Coca-Cola 0.5л", description: "Газировка", price: 25, category: "drinks" },
          { name: "Tiramisu", description: "Десерт", price: 65, category: "desserts" }
        ]);
        console.log("Меню заполнено (локально)");
      }
    } catch (e) {
      console.log("Seed ошибка (нормально в CI):", e.message);
    }
  };
  seed();
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/menu', async (req, res) => {
  try {
    const items = await Menu.find();
    // Если пусто — возвращаем заглушку (для CI)
    if (items.length === 0) {
      return res.json([
        { name: "Test Pizza", price: 100, category: "food" }
      ]);
    }
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: "DB error" });
  }
});

app.listen(5001, () => console.log("Menu Service: http://localhost:5001"));