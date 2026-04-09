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
  createdAt: { type: Date, default: Date.now },
  reviewApproved: { type: Boolean, default: false }
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
    const pending = await Order.find({ 
      status: { $in: ["new", "confirmed"] },
      delivery: false 
  }).sort({ createdAt: -1 });
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
        paid: order.paid || false  // в корне объекта
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
      await Notification.create({
        userId: decoded.userId,
        title: "Отредактирован отзыв",
        message: `Пользователь отредактировал отзыв к заказу №${order._id.toString().slice(-6)}. Комментарий: ${comment}`,
        category: "Отзывы"
      });
    } else {
      await Notification.create({
        userId: decoded.userId,
        title: "Новый отзыв на проверке",
        message: `Новый отзыв к заказу №${order._id.toString().slice(-6)}. Рейтинг: ${rating}, Комментарий: ${comment}`,
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

app.post('/admin/booking/:orderId/cancel', async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ success: false, message: "Причина обязательна" });

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: "cancelled_by_admin", rejectionReason: reason },
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false });

    await Notification.create({
      userId: order.userId,
      title: "Бронь отменена администрацией",
      message: `Ваша бронь столика №${order.tableNumber} на ${order.reservationDate} отменена.\nПричина: ${reason}`,
      category: "Администрация"
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.get('/admin/reviews/pending', async (req, res) => {
  try {
    const pending = await Order.find({
      reviewed: true,
      reviewApproved: false,
      reviewComment: { $exists: true, $ne: "" }
    }).sort({ updatedAt: -1 });

    res.json(pending.map(order => ({
      _id: order._id,
      userId: order.userId,
      orderNumber: order._id.toString().slice(-6),
      rating: order.reviewRating,
      comment: order.reviewComment,
      createdAt: order.updatedAt || order.createdAt,
      items: order.items // если нужно показывать блюда
    })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.post('/admin/reviews/:orderId/approve', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { reviewApproved: true },
      { new: true }
    );

    if (!order) return res.status(404).json({ error: "Отзыв не найден" });

    // Уведомление пользователю
    await Notification.create({
      userId: order.userId,
      title: "Ваш отзыв одобрен",
      message: `Отзыв к заказу №${order._id.toString().slice(-6)} прошёл модерацию и теперь виден всем.`,
      category: "Отзывы"
    });

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(5004, () => {
  console.log('Admin Service (заказы): http://localhost:5004');
});