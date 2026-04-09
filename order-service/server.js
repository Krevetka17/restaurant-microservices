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
  tableDescription: { type: String },        // Новое поле
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

// ====================== ИНФОРМАЦИЯ О СТОЛИКАХ (20 столиков) ======================
const tablesInfo = [
  { number: 1,  capacity: 2, description: "Столик у окна, специально для двоих" },
  { number: 2,  capacity: 2, description: "Уютный столик у стены для пары" },
  { number: 3,  capacity: 4, description: "Столик у окна на 4 человека" },
  { number: 4,  capacity: 4, description: "Большой столик в центре зала на 4 человека" },
  { number: 5,  capacity: 3, description: "Столик у стены для небольшой компании" },
  { number: 6,  capacity: 6, description: "Просторный столик у окна на 6 человек" },
  { number: 7,  capacity: 2, description: "Романтический столик у окна" },
  { number: 8,  capacity: 4, description: "Столик у стены на 4 человека" },
  { number: 9,  capacity: 8, description: "Большой стол для компании до 8 человек" },
  { number: 10, capacity: 8, description: "Большой стол для компании до 8 человек" },
  { number: 11, capacity: 2, description: "Столик у окна для двоих" },
  { number: 12, capacity: 4, description: "Столик в тихом углу на 4 человека" },
  { number: 13, capacity: 3, description: "Небольшой столик у стены" },
  { number: 14, capacity: 6, description: "Столик у окна для компании" },
  { number: 15, capacity: 4, description: "Столик у стены на 4 человека" },
  { number: 16, capacity: 2, description: "Уютный столик для пары" },
  { number: 17, capacity: 4, description: "Столик в центре на 4 человека" },
  { number: 18, capacity: 6, description: "Просторный стол на 6 человек" },
  { number: 19, capacity: 8, description: "Большой стол для большой компании до 8 человек" },
  { number: 20, capacity: 8, description: "Большой стол для компании до 8 человек" }
];

app.get('/tables/info', (req, res) => {
  res.json(tablesInfo);
});

// POST /orders
app.post('/orders', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId обязателен" });
    }

    const { delivery, tableNumber, reservationDate, startTime, endTime, tableDescription } = req.body;

    if (!delivery) {
      if (endTime) {
        // Бронь столика с временем
        if (!tableNumber || !reservationDate || !startTime || !endTime) {
          return res.status(400).json({ success: false, message: "Для брони столика нужны все данные" });
        }

        const conflicting = await Order.findOne({
          delivery: false,
          tableNumber,
          reservationDate,
          $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }]
        });

        if (conflicting) {
          return res.status(400).json({ success: false, message: "Столик занят на это время" });
        }
      }
      // Если endTime нет — простой заказ "на месте" без брони времени
    }

    const order = new Order({
      ...req.body,
      tableDescription: tableDescription || null
    });

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

// GET /tables/available — 20 столиков
app.get('/tables/available', async (req, res) => {
  try {
    const { date, start, duration = 120 } = req.query;
    if (!date || !start) return res.status(400).json({ success: false, message: "Нужны date и start" });

    const endMinutes = parseTime(start) + parseInt(duration) + 45;
    const endTime = formatTime(endMinutes);

    const allTables = Array.from({ length: 20 }, (_, i) => i + 1);

    const booked = await Order.find({
      delivery: false,
      reservationDate: date,
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: start } }]
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

    const allTables = Array.from({ length: 20 }, (_, i) => i + 1);

    const booked = await Order.find({
      delivery: false,
      reservationDate: date,
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }]
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

    await order.save();
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Получить только ожидающие заказы (pending + confirmed)
app.get('/admin/pending-orders', async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $in: ["new", "confirmed"] }
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(5003, () => console.log("Order Service: http://localhost:5003"));