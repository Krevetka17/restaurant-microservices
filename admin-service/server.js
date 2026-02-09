const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к order_db
const orderConn = mongoose.createConnection('mongodb://localhost:27017/order_db');
const Order = orderConn.model('Order', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  items: Array,
  total: Number,
  delivery: { type: Boolean, required: true },
  address: { type: String },
  tableNumber: { type: Number },
  reservationDate: { type: String },
  startTime: { type: String },
  endTime: { type: String },
  status: { type: String, default: "new" },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now }
}));

// Подключение к auth_db для уведомлений
const authConn = mongoose.createConnection('mongodb://localhost:27017/auth_db');
const Notification = authConn.model('Notification', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  category: { type: String, default: "Администрация" },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}));

const MENU_SERVICE_URL = 'http://localhost:5001/menu';

let menuCache = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000;

const getMenu = async () => {
  if (menuCache && Date.now() - cacheTime < CACHE_DURATION) return menuCache;
  try {
    const response = await axios.get(MENU_SERVICE_URL);
    menuCache = response.data.reduce((map, item) => {
      map[item._id] = item.name;
      return map;
    }, {});
    cacheTime = Date.now();
    return menuCache;
  } catch (error) {
    console.error('Ошибка меню:', error.message);
    return {};
  }
};

app.get('/admin/orders/pending', async (req, res) => {
  try {
    const pending = await Order.find({ status: "new" }).sort({ createdAt: -1 });
    const menuMap = await getMenu();

    const enriched = pending.map(order => {
      const enrichedItems = order.items.map(item => ({
        menuItemId: item.menuItemId,
        name: menuMap[item.menuItemId] || "Неизвестное блюдо",
        quantity: item.quantity,
        price: item.price
      }));
      return { 
        ...order.toObject(), 
        items: enrichedItems,
        paid: order.paid || false  // ← здесь, в корне объекта
      };
    });

    res.json(enriched);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.post('/admin/orders/:id/confirm', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "confirmed" },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false });

    await Notification.create({
      userId: order.userId,  // уже ObjectId — просто передаём
      title: "Заказ подтверждён",
      message: `Ваш заказ №${order._id.toString().slice(-6)} подтверждён администрацией! Проверьте в "Мои заказы/Бронь".`,
      category: "Администрация"
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка подтверждения:', error);
    res.status(500).json({ success: false });
  }
});

app.post('/admin/orders/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ success: false, message: "Причина обязательна" });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", rejectionReason: reason },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false });

    await Notification.create({
      userId: order.userId,  // уже ObjectId — просто передаём
      title: "Заказ отклонён",
      message: `Ваш заказ №${order._id.toString().slice(-6)} отклонён. Причина: ${reason}. Проверьте в "Мои заказы/Бронь".`,
      category: "Администрация"
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка отклонения:', error);
    res.status(500).json({ success: false });
  }
});

app.listen(5004, () => {
  console.log('Admin Service (заказы): http://localhost:5004');
});