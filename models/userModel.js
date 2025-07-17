const { executeQuery } = require('../utils/dbUtils');
const bcrypt = require('bcryptjs');
const { AppError } = require('../middleware/errorMiddleware');

class UserModel {
  /**
   * 创建新用户
   * @param {string} username - 用户名
   * @param {string} email - 邮箱
   * @param {string} password - 密码
   * @returns {Promise<Object>} 创建的用户对象（不含密码）
   * @throws {AppError} 当用户名或邮箱已被注册时抛出
   */
  static async createUser(username, email, password) {
    try {
      // 密码加密
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 插入用户数据
      const result = await executeQuery(
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

  /**
   * 根据用户名获取用户
   * @param {string} username - 用户名
   * @returns {Promise<Object|null>} 用户对象或null（如果不存在）
   * @throws {AppError} 当查询失败时抛出
   */
  static async getUserByUsername(username) {
    try {
      const rows = await executeQuery('SELECT * FROM users WHERE username = ?', [username]);
      return rows[0] || null;
    } catch (error) {
      throw new AppError(`获取用户失败: ${error.message}`, 500);
    }
  }
}

module.exports = UserModel;