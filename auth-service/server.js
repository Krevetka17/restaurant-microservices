const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

mongoose.connect(
  process.env.MONGO_URI || 
  (process.env.DOCKER ? 'mongodb://mongodb:27017' : 'mongodb://localhost:27017') +
  '/auth_db'
);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  login: { type: String, unique: true },
  email: { type: String, unique: true, required: true },
  phone: String,
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  avatar: { type: String }
});

const User = mongoose.model('User', userSchema);

// === ПЕРЕМЕЩАЕМ СЮДА ВСЕ МОДЕЛИ, ЧТОБЫ ОНИ БЫЛИ ДОЛЖНЫ ===
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  category: { type: String, default: "Система" },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema); // ← СЕЙЧАС ОПРЕДЕЛЕНА!

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
// ==============================================================

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "secret123";
const THIRTY_DAYS = 30 * 24 * 60 * 60;

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
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Неверные данные" });
  }
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

// === ЗАПРОСЫ НА РЕДАКТИРОВАНИЕ ===
app.post('/profile/edit-request', async (req, res) => {
  const { userId, oldData, newData } = req.body;
  const request = new EditProfileRequest({ userId, oldData, newData });
  await request.save();
  res.json({ success: true, request });
});

app.get('/admin/edit-requests', async (req, res) => {
  const requests = await EditProfileRequest.find({ status: "pending" })
    .populate('userId', 'name email')
    .populate('processedBy', 'name')
    .sort({ requestedAt: -1 });
  res.json(requests);
});

app.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Нет токена" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      avatar: user.avatar
    });
  } catch (e) {
    res.status(401).json({ error: "Недействительный токен" });
  }
});

// Обработать запрос (принять/отклонить)
app.post('/admin/edit-request/:id/resolve', async (req, res) => {
  const { id } = req.params;
  const { action, adminId } = req.body;

  const request = await EditProfileRequest.findById(id).populate('userId');
  if (!request) return res.status(404).json({ error: "Not found" });

  if (action === 'approve') {
    const updatedUser = await User.findByIdAndUpdate(
        request.userId._id,
        {
            name: request.newData.name,
            email: request.newData.email,
            phone: request.newData.phone,
            avatar: request.newData.avatar
        },
        { new: true }  // ← ВАЖНО: возвращать обновлённый документ
    );

    // Отправляем клиенту свежие данные!
    return res.json({ 
        success: true, 
        user: {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            isAdmin: updatedUser.isAdmin,
            avatar: updatedUser.avatar
        }
    });
}

  request.status = action === 'approve' ? 'approved' : 'rejected';
  request.processedAt = new Date();
  request.processedBy = adminId;
  await request.save();

  // ← ТЕПЕРЬ Notification УЖЕ СУЩЕСТВУЕТ!
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

  await notification.save(); // ← Теперь сохранится без ошибок!

  res.json({ success: true });
});

// Получить уведомления пользователя
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

app.listen(5002, () => console.log("Auth Service: http://localhost:5002"));