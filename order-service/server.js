const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect('mongodb://localhost:27017/order_db');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Обязательное поле
  items: Array,
  total: Number,
  delivery: { type: Boolean, required: true },
  address: { type: String },
  tableNumber: { type: Number },
  reservationDate: { type: String },
  startTime: { type: String },
  endTime: { type: String },
  status: { type: String, default: "new" },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

const app = express();
app.use(cors());
app.use(express.json());

// POST /orders — теперь строго требует userId
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

    const order = new Order(req.body); // userId теперь обязателен в body
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

// Остальные эндпоинты без изменений
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

app.listen(5003, () => console.log("Order Service: http://localhost:5003"));