const { AppError } = require("../middleware/errorMiddleware");
const { executeQuery } = require("../utils/dbUtils");

class TransactionModel {
  /**
   * 创建新交易记录
   * @param {number} userId - 用户ID
   * @param {number} amount - 交易金额
   * @param {string} typeId - 交易类型ID
   * @param {string} categoryId - 交易分类ID
   * @param {string} description - 交易描述
   * @param {string} transactionDate - 交易日期
   * @returns {Promise<Object>} 创建的交易记录对象
   * @throws {AppError} 当交易类型无效时抛出
   */
  static async createTransaction(
    userId,
    amount,
    typeId,
    categoryId,
    description,
    transactionDate
  ) {
    try {
      // 创建交易记录
      const result = await executeQuery(
        "INSERT INTO transactions (user_id, amount, type_id, category_id, description, transaction_date) VALUES (?, ?, ?, ?, ?, ?)",
        [userId, amount, typeId, categoryId, description, transactionDate]
      );

      // // 获取创建的交易记录
      // const transaction = await executeQuery(
      //   // "SELECT t.*, tt.name as type FROM transactions t JOIN transaction_types tt ON t.type_id = tt.id WHERE t.id = ?",
      //   "SELECT t.*, tt.name as type, c.name as category, c.icon as category_icon FROM transactions t JOIN transaction_types tt ON t.type_id = tt.id LEFT JOIN categories c ON t.category_id = c.id WHERE t.id = ?",
      //   [result.insertId]
      // );

      // return transaction[0];
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取用户的所有交易记录
   * @param {number} userId - 用户ID
   * @param {string} description - 交易描述（可选）
   * @param {string} typeId - 交易类型ID（可选）
   * @param {string} categoryId - 交易分类ID（可选）
   * @param {string} startDate - 起始日期（可选）
   * @param {string} endDate - 结束日期（可选）
   * @param {number} limit - 每页记录数（可选）
   * @param {number} offset - 偏移量（可选）
   * @returns {Promise<Array>} 交易记录数组
   */
  static async getUserTransactions({
    userId,
    description,
    typeId,
    categoryId,
    startDate,
    endDate,
    limit = 10,
    offset = 0,
  }) {
    try {
      let sql = `
      SELECT 
        t.id,
        t.user_id,
        t.amount,
        tt.name AS type_name,
        t.type_id,
        t.category_id,
        c.name AS category_name,
        c.icon AS category_icon,
        t.description,
        DATE_FORMAT(t.transaction_date, '%Y-%m-%d') AS transaction_date,
        t.created_at,
        t.updated_at
      FROM transactions t
      JOIN transaction_types tt ON t.type_id = tt.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
    `;

      const values = [userId];

      if (description) {
        sql += ` AND t.description LIKE ?`;
        values.push(`%${description}%`);
      }

      if (typeId) {
        sql += ` AND t.type_id = ?`;
        values.push(typeId);
      }

      if (categoryId) {
        sql += ` AND t.category_id = ?`;
        values.push(categoryId);
      }

      if (startDate) {
        sql += ` AND t.transaction_date >= ?`;
        values.push(startDate);
      }

      if (endDate) {
        sql += ` AND t.transaction_date <= ?`;
        values.push(endDate);
      }

      sql += ` ORDER BY t.transaction_date DESC, t.id DESC`;

      // ✅ 先解析 limit/offset，保证是整数
      const safeLimit = parseInt(limit, 10) || 10;
      const safeOffset = parseInt(offset, 10) || 0;

      // sql += ` ORDER BY t.transaction_date DESC, t.id DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;
      sql += ` LIMIT ${safeLimit} OFFSET ${safeOffset}`;

      return await executeQuery(sql, values);
    } catch (err) {
      throw err;
    }
  }

  /**
   * 获取特定交易记录
   * @param {number} userId - 用户ID
   * @param {number} transactionId - 交易记录ID
   * @returns {Promise<Object|null>} 交易记录对象或null（如果不存在）
   */
  static async getTransactionById(transactionId, userId) {
    const sql = "SELECT * FROM transactions WHERE id = ? AND user_id = ?";
    try {
      const transactions = await executeQuery(sql, [transactionId, userId]);
      return transactions[0] || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 更新交易记录
   * @param {number} transactionId - 交易记录ID
   * @param {number} userId - 用户ID
   * @param {number} amount - 新的交易金额
   * @param {string} typeId - 新的交易类型ID
   * @param {string} categoryId - 新的交易分类ID
   * @param {string} description - 新的交易描述
   * @param {string} transactionDate - 新的交易日期
   * @returns {Promise<boolean>} 是否更新成功
   * @throws {AppError} 当交易类型无效时抛出
   */
  static async updateTransaction(
    transactionId,
    userId,
    amount,
    typeId,
    categoryId,
    description,
    transactionDate
  ) {
    try {
      // 更新交易记录
      const result = await executeQuery(
        "UPDATE transactions SET amount = ?, type_id = ?, category_id = ?, description = ?, transaction_date = ? WHERE id = ? AND user_id = ?",
        [
          amount,
          typeId,
          categoryId,
          description,
          transactionDate,
          transactionId,
          userId,
        ]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 删除交易记录
   * @param {number} transactionId - 交易记录ID
   * @param {number} userId - 用户ID
   * @returns {Promise<boolean>} 是否删除成功
   */
  static async deleteTransaction(transactionId, userId) {
    try {
      const result = await executeQuery(
        "DELETE FROM transactions WHERE id = ? AND user_id = ?",
        [transactionId, userId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TransactionModel;
