const TransactionModel = require('../models/transactionModel');
const { ValidationError, NotFoundError } = require('../middleware/errorMiddleware');

class TransactionController {
  // 创建新交易记录
  static async createTransaction(req, res, next) {
    try {
      const { amount, type, category, description, transactionDate } = req.body;
      const userId = req.user.userId; // 从认证中间件获取用户ID

      // 基本输入验证
      if (!amount || !type || !category || !transactionDate) {
        throw new ValidationError('金额、类型、分类和交易日期为必填项');
      }

      if (type !== 'income' && type !== 'expense') {
        throw new ValidationError('交易类型必须是income或expense');
      }

      // 创建交易记录
      const newTransaction = await TransactionModel.createTransaction(
        userId, amount, type, category, description, transactionDate
      );

      res.status(201).json({ message: '交易记录创建成功', transaction: newTransaction });
    } catch (error) {
      next(error);
    }
  }

  // 获取用户的所有交易记录
  static async getUserTransactions(req, res, next) {
    try {
      const userId = req.user.userId;

      const transactions = await TransactionModel.getUserTransactions(userId);
      res.json({ transactions });
    } catch (error) {
      next(error);
    }
  }

  // 获取特定交易记录
  static async getTransactionById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const transaction = await TransactionModel.getTransactionById(userId, id);
      if (!transaction) {
        throw new NotFoundError('未找到该交易记录');
      }

      res.json({ transaction });
    } catch (error) {
      next(error);
    }
  }

  // 更新交易记录
  static async updateTransaction(req, res, next) {
    try {
      const { id } = req.params;
      const { amount, type, category, description, transactionDate } = req.body;
      const userId = req.user.userId;

      // 基本输入验证
      if (!amount || !type || !category || !transactionDate) {
        throw new ValidationError('金额、类型、分类和交易日期为必填项');
      }

      if (type !== 'income' && type !== 'expense') {
        throw new ValidationError('交易类型必须是income或expense');
      }

      // 更新交易记录
      const updated = await TransactionModel.updateTransaction(
        id, userId, amount, type, category, description, transactionDate
      );

      if (updated) {
        res.json({ message: '交易记录更新成功' });
      } else {
        throw new NotFoundError('未找到该交易记录或无权修改');
      }
    } catch (error) {
      next(error);
    }
  }

  // 删除交易记录
  static async deleteTransaction(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      // 删除交易记录
      const deleted = await TransactionModel.deleteTransaction(id, userId);

      if (deleted) {
        res.json({ message: '交易记录删除成功' });
      } else {
        throw new NotFoundError('未找到该交易记录或无权删除');
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TransactionController;