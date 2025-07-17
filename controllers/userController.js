const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ValidationError, NotFoundError } = require('../middleware/errorMiddleware');
require('dotenv').config();

// JWT密钥（从环境变量获取）
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h'; // token有效期

class UserController {
  // 用户注册
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;

      // 基本输入验证
      if (!username || !email || !password) {
        throw new ValidationError('所有字段均为必填项');
      }

      // 检查用户是否已存在
      const existingUser = await UserModel.getUserByUsername(username);
      if (existingUser) {
        throw new ValidationError('用户名已被注册');
      }

      // 创建新用户
      const newUser = await UserModel.createUser(username, email, password);
      res.status(201).json({ message: '用户注册成功', user: newUser });
    } catch (error) {
      next(error);
    }
  }

  // 用户登录
  static async login(req, res, next) {
    try {
      const { username, password } = req.body;

      // 基本输入验证
      if (!username || !password) {
        throw new ValidationError('用户名和密码均为必填项');
      }

      // 查询用户
      const user = await UserModel.getUserByUsername(username);
      if (!user) {
        throw new NotFoundError('用户名或密码错误');
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new NotFoundError('用户名或密码错误');
      }

      // 生成JWT令牌
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.json({ message: '登录成功', token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;