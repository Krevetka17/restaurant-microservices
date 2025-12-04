// gateway/server.js — ЭТО РАБОТАЕТ НА ВСЕХ МАШИНАХ!
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/menu', createProxyMiddleware({
  target: process.env.DOCKER ? 'http://menu-service:5001' : 'http://localhost:5001',
  changeOrigin: true,
  pathRewrite: { '^/api/menu': '' },
}));

app.use('/api/auth', createProxyMiddleware({ 
  target: process.env.DOCKER ? 'http://auth-service:5002' : 'http://localhost:5002', 
  changeOrigin: true 
}));

app.use('/api/orders', createProxyMiddleware({ 
  target: process.env.DOCKER ? 'http://order-service:5003' : 'http://localhost:5003', 
  changeOrigin: true 
}));

app.listen(5000, () => {
  console.log('GATEWAY РАБОТАЕТ: http://localhost:5000');
  console.log('МЕНЮ: http://localhost:5000/api/menu');
});