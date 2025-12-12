const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect('mongodb://localhost:27017/admin_db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Admin service работает!' });
});

app.listen(5004, () => {
  console.log('Admin Service: http://localhost:5004');
});