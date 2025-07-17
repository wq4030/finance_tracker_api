const jwt = require('jsonwebtoken');
require('dotenv').config();

// JWT密钥（从环境变量获取）
const JWT_SECRET = process.env.JWT_SECRET;

// 认证中间件
const authenticateToken = (req, res, next) => {
  // 从请求头获取token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN格式

  if (!token) {
    return res.status(401).json({ message: '未提供认证token' });
  }

  // 验证token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'token无效或已过期' });
    }
    req.user = user; // 将用户信息附加到请求对象
    next();
  });
};

module.exports = { authenticateToken };