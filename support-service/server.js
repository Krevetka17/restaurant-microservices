const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect('mongodb://localhost:27017/support_db');

const messageSchema = new mongoose.Schema({
  text: String,
  fromAdmin: { type: Boolean, default: false },
  adminId: String,
  timestamp: { type: Date, default: Date.now }
});

const ticketSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Support service работает!' }));

// Отправка от пользователя
app.post('/messages', async (req, res) => {
  let { message, userId, ticketId } = req.body;
  if (!userId || !message) return res.status(400).json({ error: "Missing data" });

  let ticket;
  if (ticketId) {
    ticket = await Ticket.findById(ticketId);
  }

  if (!ticket) {
    ticket = new Ticket({ userId, messages: [] });
  }

  ticket.messages.push({ text: message, fromAdmin: false });
  ticket.updatedAt = new Date();
  await ticket.save();

  res.json({ success: true, ticketId: ticket._id });
});

// Отправка от админа
app.post('/messages/admin', async (req, res) => {
  const { message, ticketId, adminId } = req.body;
  if (!ticketId || !message) return res.status(400).json({ error: "Missing data" });

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });

  ticket.messages.push({ text: message, fromAdmin: true, adminId });
  ticket.updatedAt = new Date();
  await ticket.save();

  res.json({ success: true });
});

// Список тикетов для пользователя
app.get('/tickets', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "userId required" });

  const tickets = await Ticket.find({ userId }).sort({ updatedAt: -1 });
  res.json(tickets.map(t => ({
    ticketId: t._id,
    lastMessage: t.messages[t.messages.length - 1]?.text || "",
    lastTimestamp: t.updatedAt
  })));
});

// Все тикеты для админа
app.get('/tickets/all', async (req, res) => {
  const tickets = await Ticket.find({}).sort({ updatedAt: -1 });
  const result = await Promise.all(tickets.map(async t => {
    const user = await mongoose.connection.db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(t.userId) });
    return {
      ticketId: t._id,
      userId: t.userId,
      userName: user?.name || "Неизвестно",
      lastMessage: t.messages[t.messages.length - 1]?.text || "",
      lastTimestamp: t.updatedAt
    };
  }));
  res.json(result);
});

// Сообщения тикета
app.get('/messages', async (req, res) => {
  const { ticketId } = req.query;
  if (!ticketId) return res.status(400).json({ error: "ticketId required" });

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return res.status(404).json({ error: "Not found" });

  res.json(ticket.messages.map(m => ({
    _id: m._id,
    message: m.text,
    isFromSupport: m.fromAdmin,
    timestamp: m.timestamp
  })));
});

// Инфо о тикете (userId)
app.get('/ticket/info', async (req, res) => {
  const { ticketId } = req.query;
  if (!ticketId) return res.status(400).json({ error: "ticketId required" });

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });

  res.json({ userId: ticket.userId });
});

// Аватар пользователя из auth_db
app.get('/user/avatar', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId required" });

  try {
    const user = await mongoose.connection.db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(userId) });
    res.json({ avatar: user?.avatar || null });
  } catch (e) {
    res.status(500).json({ error: "Error" });
  }
});

app.listen(5005, () => console.log('Support Service: http://localhost:5005'));