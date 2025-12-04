// gateway/server.js — РАБОТАЕТ ВЕЗДЕ!
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const isDocker = !!process.env.DOCKER;

// Меню: /api/menu → http://menu-service:5001/menu → убираем /api/menu
app.use('/api/menu', createProxyMiddleware({
  target: isDocker ? 'http://menu-service:5001' : 'http://localhost:5001',
  changeOrigin: true,
  pathRewrite: { '^/api/menu': '/menu' }, 
}));

// Авторизация: /api/auth/* → http://auth-service:5002/*
app.use('/api/auth', createProxyMiddleware({
  target: isDocker ? 'http://auth-service:5002' : 'http://localhost:5002',
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '' },
}));

// Заказы: /api/orders/* → http://order-service:5003/*
app.use('/api/orders', createProxyMiddleware({
  target: isDocker ? 'http://order-service:5003' : 'http://localhost:5003',
  changeOrigin: true,
  pathRewrite: { '^/api/orders': '' },
}));

app.listen(5000, () => {
  console.log('GATEWAY РАБОТАЕТ: http://localhost:5000');
  console.log('МЕНЮ: http://localhost:5000/api/menu');
  console.log('АВТОРИЗАЦИЯ: http://localhost:5000/api/auth/login');
});