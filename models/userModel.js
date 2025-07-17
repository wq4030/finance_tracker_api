const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { AppError } = require('../middleware/errorMiddleware');

class UserModel {
  // 创建新用户
  static async createUser(username, email, password) {
    try {
      // 密码加密
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 插入用户数据
      const [result] = await db.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );

      // 返回创建的用户信息（不含密码）
      return { id: result.insertId, username, email };
    } catch (error) {
      // 检查是否是唯一约束冲突
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('username')) {
          throw new AppError('用户名已被注册', 400);
        } else if (error.message.includes('email')) {
          throw new AppError('邮箱已被注册', 400);
        }
      }
      throw new AppError(`创建用户失败: ${error.message}`, 500);
    }
  }

  // 根据用户名获取用户
  static async getUserByUsername(username) {
    try {
      const [rows] = await db.execute('SELECT id, username, email FROM users WHERE username = ?', [username]);
      return rows[0] || null;
    } catch (error) {
      throw new AppError(`获取用户失败: ${error.message}`, 500);
    }
  }
}

module.exports = UserModel;