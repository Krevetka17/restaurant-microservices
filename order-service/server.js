const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect(
  process.env.MONGO_URI || 
  (process.env.DOCKER ? 'mongodb://mongodb:27017' : 'mongodb://localhost:27017') +
  '/order_db'
);

const orderSchema = new mongoose.Schema({
  userId: String,
  items: Array,
  total: Number,
  tableNumber: Number,
  status: { type: String, default: "new" },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

const app = express();
app.use(cors());
app.use(express.json());

app.post('/orders', async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.json({ success: true, orderId: order._id });
});

app.get('/orders/:userId', async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId });
  res.json(orders);
});

app.listen(5003, () => console.log("Order Service: http://localhost:5003"));