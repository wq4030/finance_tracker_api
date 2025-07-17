const { AppError } = require("../middleware/errorMiddleware");
const db = require("../config/db");

class TransactionModel {
  // 创建新交易记录
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
      const [typeResult] = await db.execute(
        "SELECT id FROM transaction_types WHERE name = ?",
        [type]
      );
      if (typeResult.length === 0) {
        throw new AppError("无效的交易类型", 400);
      }
      const typeId = typeResult[0].id;

      // 创建交易记录
      const [result] = await db.execute(
        "INSERT INTO transactions (user_id, amount, type_id, category, description, transaction_date) VALUES (?, ?, ?, ?, ?, ?)",
        [userId, amount, typeId, category, description, transactionDate]
      );

      // 获取创建的交易记录
      const [transaction] = await db.execute(
        "SELECT t.*, tt.name as type FROM transactions t JOIN transaction_types tt ON t.type_id = tt.id WHERE t.id = ?",
        [result.insertId]
      );

      return transaction[0];
    } catch (error) {
      throw error;
    }
  }

  // 获取用户的所有交易记录
  static async getUserTransactions(userId) {
    try {
      const [transactions] = await db.execute(
        "SELECT t.*, tt.name as type FROM transactions t JOIN transaction_types tt ON t.type_id = tt.id WHERE user_id = ? ORDER BY transaction_date DESC",
        [userId]
      );
      return transactions;
    } catch (error) {
      throw error;
    }
  }

  // 获取特定交易记录
  static async getTransactionById(userId, transactionId) {
    const sql =
        "SELECT t.*, tt.name as type FROM transactions t JOIN transaction_types tt ON t.type_id = tt.id WHERE t.id = ? AND t.user_id = ?";
    try {
      const [transactions] = await db.execute(sql, [transactionId, userId]);
      return transactions[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // 更新交易记录
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
      const [typeResult] = await db.execute(
        "SELECT id FROM transaction_types WHERE name = ?",
        [type]
      );
      if (typeResult.length === 0) {
        throw new AppError("无效的交易类型", 400);
      }
      const typeId = typeResult[0].id;

      // 更新交易记录
      const [result] = await db.execute(
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

  // 删除交易记录
  static async deleteTransaction(transactionId, userId) {
    try {
      const [result] = await db.execute(
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
