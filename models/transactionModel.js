const { AppError } = require('../middleware/errorMiddleware');
const { executeQuery } = require('../utils/dbUtils');

class TransactionModel {
  /**
   * 创建新交易记录
   * @param {number} userId - 用户ID
   * @param {number} amount - 交易金额
   * @param {string} type - 交易类型（收入或支出）
   * @param {string} category - 交易分类
   * @param {string} description - 交易描述
   * @param {string} transactionDate - 交易日期
   * @returns {Promise<Object>} 创建的交易记录对象
   * @throws {AppError} 当交易类型无效时抛出
   */
  static async createTransaction(
    userId,
    amount,
    type,
    category,
    description,
    transactionDate
  ) {
    try {
      // 首先获取类型ID
      const typeResult = await executeQuery(
        "SELECT id FROM transaction_types WHERE name = ?",
        [type]
      );
      if (typeResult.length === 0) {
        throw new AppError("无效的交易类型", 400);
      }
      const typeId = typeResult[0].id;

      // 创建交易记录
      const result = await executeQuery(
        "INSERT INTO transactions (user_id, amount, type_id, category, description, transaction_date) VALUES (?, ?, ?, ?, ?, ?)",
        [userId, amount, typeId, category, description, transactionDate]
      );

      // 获取创建的交易记录
      const transaction = await executeQuery(
        "SELECT t.*, tt.name as type FROM transactions t JOIN transaction_types tt ON t.type_id = tt.id WHERE t.id = ?",
        [result.insertId]
      );

      return transaction[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取用户的所有交易记录
   * @param {number} userId - 用户ID
   * @returns {Promise<Array>} 交易记录数组
   */
  static async getUserTransactions(userId) {
    try {
      const transactions = await executeQuery(
        "SELECT t.*, tt.name as type FROM transactions t JOIN transaction_types tt ON t.type_id = tt.id WHERE user_id = ? ORDER BY transaction_date DESC",
        [userId]
      );
      return transactions;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取特定交易记录
   * @param {number} userId - 用户ID
   * @param {number} transactionId - 交易记录ID
   * @returns {Promise<Object|null>} 交易记录对象或null（如果不存在）
   */
  static async getTransactionById(transactionId, userId) {
    const sql =
        "SELECT t.*, tt.name as type FROM transactions t JOIN transaction_types tt ON t.type_id = tt.id WHERE t.id = ? AND t.user_id = ?";
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
   * @param {string} type - 新的交易类型
   * @param {string} category - 新的交易分类
   * @param {string} description - 新的交易描述
   * @param {string} transactionDate - 新的交易日期
   * @returns {Promise<boolean>} 是否更新成功
   * @throws {AppError} 当交易类型无效时抛出
   */
  static async updateTransaction(
    transactionId,
    userId,
    amount,
    type,
    category,
    description,
    transactionDate
  ) {
    try {
      // 首先获取类型ID
      const typeResult = await executeQuery(
        "SELECT id FROM transaction_types WHERE name = ?",
        [type]
      );
      if (typeResult.length === 0) {
        throw new AppError("无效的交易类型", 400);
      }
      const typeId = typeResult[0].id;

      // 更新交易记录
      const result = await executeQuery(
        "UPDATE transactions SET amount = ?, type_id = ?, category = ?, description = ?, transaction_date = ? WHERE id = ? AND user_id = ?",
        [
          amount,
          typeId,
          category,
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
