require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

mongoose.connect('mongodb://localhost:27017/auth_db');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  login: { type: String, unique: true },
  email: { type: String, unique: true, required: true },
  phone: String,
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  avatar: { type: String },
  stripeCustomerId: { type: String }
});

const User = mongoose.model('User', userSchema);

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  category: { type: String, default: "Система" },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

const editProfileRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  oldData: { type: Object, required: true },
  newData: { type: Object, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now },
  processedAt: Date,
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const EditProfileRequest = mongoose.model('EditProfileRequest', editProfileRequestSchema);

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "secret123";
const THIRTY_DAYS = 30 * 24 * 60 * 60;

// Создать SetupIntent
app.post('/setup-intent', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Нет токена" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    let user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { mongoId: user._id.toString() }
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: user.stripeCustomerId,
      payment_method_types: ['card'],
      usage: 'off_session'
    });

    res.json({ clientSecret: setupIntent.client_secret });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Подтвердить SetupIntent (вызывается после успешного PaymentSheet)
app.post('/confirm-setup', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Нет токена" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || !user.stripeCustomerId) return res.status(404).json({ error: "Нет клиента" });

    const { payment_method } = req.body;
    if (!payment_method) return res.status(400).json({ error: "Нет payment_method" });

    await stripe.paymentMethods.attach(payment_method, {
      customer: user.stripeCustomerId,
    });

    await stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: { default_payment_method: payment_method },
    });

    const pmList = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card',
    });

    const paymentMethods = pmList.data.map(pm => ({
      id: pm.id,
      cardNumber: `**** **** **** ${pm.card.last4}`,
      expiry: `${pm.card.exp_month.toString().padStart(2, '0')}/${(pm.card.exp_year % 100).toString().padStart(2, '0')}`,
      brand: pm.card.brand
    }));

    res.json({ success: true, paymentMethods });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Получить текущего пользователя
app.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Нет токена" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    let paymentMethods = [];
    if (user.stripeCustomerId) {
      const pmList = await stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: 'card',
        limit: 10
      });
      paymentMethods = pmList.data.map(pm => ({
        id: pm.id,
        cardNumber: `**** **** **** ${pm.card.last4}`,
        expiry: `${pm.card.exp_month.toString().padStart(2, '0')}/${(pm.card.exp_year % 100).toString().padStart(2, '0')}`,
        brand: pm.card.brand
      }));
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      stripeCustomerId: user.stripeCustomerId,
      paymentMethods
    });
  } catch (e) {
    res.status(401).json({ error: "Недействительный токен" });
  }
});

// Регистрация
app.post('/register', async (req, res) => {
  const { name, login, email, phone, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Обязательные поля" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, login, email, phone, password: hashed });
  await user.save();

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: THIRTY_DAYS });
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      avatar: user.avatar
    }
  });
});

// Логин
app.post('/login', async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Введите логин/email и пароль" });
  }

  email = email.trim().toLowerCase();

  const user = await User.findOne({
    $or: [
      { email: email.trim().toLowerCase() },
      { login: email.trim().toLowerCase() }
    ]
  });

  if (!user) {
    return res.status(401).json({ error: "Пользователь не найден" });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: "Неверный пароль" });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: THIRTY_DAYS
  });

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      avatar: user.avatar
    }
  });
});


// Уведомления
app.get('/notifications', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Нет токена" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const notifications = await Notification.find({ userId: decoded.userId })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (e) {
    res.status(401).json({ error: "Ошибка" });
  }
});

app.post('/notifications/:id/read', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Нет токена" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const notificationId = req.params.id;

    const result = await Notification.updateOne(
      { _id: notificationId, userId: decoded.userId },
      { $set: { isRead: true } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Уведомление не найдено или уже прочитано" });
    }

    res.json({ success: true });
  } catch (e) {
    res.status(401).json({ error: "Недействительный токен" });
  }
});

// Запросы на редактирование профиля
app.post('/profile/edit-request', async (req, res) => {
  const { userId, oldData, newData } = req.body;
  const request = new EditProfileRequest({ userId, oldData, newData });
  await request.save();
  res.json({ success: true, request });
});

app.get('/admin/edit-requests', async (req, res) => {
  const requests = await EditProfileRequest.find({ status: "pending" })
    .populate('userId', 'name email avatar')
    .populate('processedBy', 'name')
    .sort({ requestedAt: -1 });
  res.json(requests);
});

app.post('/admin/edit-request/:id/resolve', async (req, res) => {
  const { id } = req.params;
  const { action, adminId } = req.body;

  const request = await EditProfileRequest.findById(id).populate('userId');
  if (!request) return res.status(404).json({ error: "Not found" });

  let updatedUser = null;

  if (action === 'approve') {
    updatedUser = await User.findByIdAndUpdate(
      request.userId._id,
      {
        name: request.newData.name,
        email: request.newData.email,
        phone: request.newData.phone,
        avatar: request.newData.avatar
      },
      { new: true }
    );
  }

  request.status = action === 'approve' ? 'approved' : 'rejected';
  request.processedAt = new Date();
  request.processedBy = adminId;
  await request.save();

  const notificationTitle = action === 'approve'
    ? "Изменения профиля одобрены"
    : "Изменения профиля отклонены";

  const notificationMessage = action === 'approve'
    ? "Ваши новые данные успешно сохранены!"
    : "Администратор отклонил изменения. Попробуйте позже.";

  const notification = new Notification({
    userId: request.userId._id,
    title: notificationTitle,
    message: notificationMessage,
    category: "Администрация",
    isRead: false,
    createdAt: new Date()
  });
  await notification.save();

  res.json({
    success: true,
    user: updatedUser ? {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
      avatar: updatedUser.avatar
    } : null
  });
});

// Удалить карту
app.delete('/payment-methods/:pmId', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Нет токена" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || !user.stripeCustomerId) return res.status(404).json({ error: "Нет клиента" });

    await stripe.paymentMethods.detach(req.params.pmId);

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Схема заказа (добавь в начало файла, если нет)
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: Array,
  total: Number,
  delivery: Boolean,
  address: String,
  tableNumber: Number,
  reservationDate: String,
  startTime: String,
  endTime: String,
  paymentMethod: String,
  paymentMethodId: String,
  status: { type: String, default: "new" },
  paid: { type: Boolean, default: false },
  reviewed: { type: Boolean, default: false },           // ← новое
  reviewComment: String,                                 // ← новое
  reviewRating: Number,                                  // ← новое
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Получить свои заказы (для PendingReviews)
app.get('/orders/my', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Нет токена" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const orders = await Order.find({ userId: decoded.userId })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) {
    res.status(401).json({ error: "Недействительный токен" });
  }
});

// Отправить отзыв
app.post('/orders/:orderId/review', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Нет токена" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { comment, rating } = req.body;
    const order = await Order.findOne({ _id: req.params.orderId, userId: decoded.userId });

    if (!order) return res.status(404).json({ error: "Заказ не найден" });
    if (order.status !== "completed") return res.status(400).json({ error: "Заказ не завершён" });
    if (order.reviewed) return res.status(400).json({ error: "Отзыв уже оставлен" });

    order.reviewed = true;
    order.reviewComment = comment;
    order.reviewRating = rating;
    await order.save();

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(5002, () => console.log("Auth Service: http://localhost:5002"));