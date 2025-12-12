const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect('mongodb://localhost:27017/support_db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Support service работает!' });
});

app.listen(5005, () => {
  console.log('Support Service: http://localhost:5005');
});