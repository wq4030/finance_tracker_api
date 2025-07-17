const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
// 确定当前环境
const env = process.env.NODE_ENV || 'development';

// 加载对应环境的配置文件
require('dotenv').config({ path: `.env.${env}` });

// 如果存在基础配置文件，也可以先加载基础配置
// require('dotenv').config();
// 然后加载环境特定配置并覆盖
// require('dotenv').config({ path: `.env.${env}`, override: true });
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(express.json());

// 路由配置
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);

// 基础路由测试
app.get('/', (req, res) => {
  res.json({ message: '个人记账管理系统API' });
});

// 404 错误处理
app.use((req, res, next) => {
  res.status(404).json({ message: '请求的资源不存在' });
});

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

module.exports = app;