const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');

mongoose.connect('mongodb://localhost:27017/order_db');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: Array,
  total: Number,
  delivery: { type: Boolean, required: true },
  address: { type: String },
  tableNumber: { type: Number },
  reservationDate: { type: String },
  startTime: { type: String },
  endTime: { type: String },
  status: { type: String, default: "new" },
  paymentMethodId: { type: String },
  paid: { type: Boolean, default: false },
  reviewed: { type: Boolean, default: false },
  reviewComment: String,
  reviewRating: Number,
  reviewApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

const app = express();
app.use(cors());
app.use(express.json());

// POST /orders
app.post('/orders', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId обязателен" });
    }

    const { delivery, tableNumber, reservationDate, startTime, endTime } = req.body;

    if (!delivery && endTime) {
      if (!tableNumber || !reservationDate || !startTime || !endTime) {
        return res.status(400).json({ success: false, message: "Для брони нужны все данные" });
      }

      const conflicting = await Order.findOne({
        delivery: false,
        tableNumber,
        reservationDate,
        $or: [
          { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
        ]
      });

      if (conflicting) {
        return res.status(400).json({ success: false, message: "Столик занят на это время" });
      }
    }

    const order = new Order(req.body);
    await order.save();
    res.json({ success: true, orderId: order._id });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET /orders/:userId
app.get('/orders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// GET /tables/available
app.get('/tables/available', async (req, res) => {
  try {
    const { date, start, duration = 120 } = req.query;
    if (!date || !start) return res.status(400).json({ success: false, message: "Нужны date и start" });

    const endMinutes = parseTime(start) + parseInt(duration) + 45;
    const endTime = formatTime(endMinutes);

    const allTables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const booked = await Order.find({
      delivery: false,
      reservationDate: date,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: start } }
      ]
    }).distinct('tableNumber');

    const available = allTables.filter(t => !booked.includes(t));
    res.json({ available });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// GET /tables/available-interval
app.get('/tables/available-interval', async (req, res) => {
  try {
    const { date, start, end } = req.query;
    if (!date || !start || !end) return res.status(400).json({ success: false, message: "Нужны date, start, end" });

    const allTables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const booked = await Order.find({
      delivery: false,
      reservationDate: date,
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ]
    }).distinct('tableNumber');

    const available = allTables.filter(t => !booked.includes(t));
    res.json({ available });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

function parseTime(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function formatTime(minutes) {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

app.post('/orders/:orderId/review', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Нет токена" });

  try {
    const decoded = jwt.verify(token, "secret123");
    const { comment, rating, edited } = req.body;
    const order = await Order.findOne({ _id: req.params.orderId, userId: decoded.userId });

    if (!order) return res.status(404).json({ error: "Заказ не найден" });
    if (order.status !== "confirmed") return res.status(400).json({ error: "Заказ не подтверждён" });

    order.reviewed = true;
    order.reviewComment = comment;
    order.reviewRating = Number(rating);
    order.reviewApproved = false;

    if (edited === "true") {
      // Отправляем уведомление админу
      await Notification.create({
        userId: decoded.userId,
        title: "Отредактирован отзыв",
        message: `Пользователь отредактировал отзыв к заказу №${order._id.toString().slice(-6)}. Комментарий: ${comment}`,
        category: "Отзывы"
      });
    }

    await order.save();
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(5003, () => console.log("Order Service: http://localhost:5003"));