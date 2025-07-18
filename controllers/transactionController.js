const TransactionModel = require("../models/transactionModel");
const {
  ValidationError,
  NotFoundError,
  AppError,
} = require("../middleware/errorMiddleware");

class TransactionController {
  // 创建新交易记录
  static async createTransaction(req, res, next) {
    try {
      const { amount, typeId, categoryId, description, transactionDate } =
        req.body;
      const userId = req.user.userId; // 从认证中间件获取用户ID

      // 基本输入验证
      if (!amount || !typeId || !categoryId || !transactionDate) {
        throw new ValidationError("金额、类型、分类和交易日期为必填项");
      }

      // 创建交易记录
      const newTransactionId = await TransactionModel.createTransaction(
        userId,
        amount,
        typeId,
        categoryId,
        description,
        transactionDate
      );

      res.status(201).json({
        code: 201,
        message: "交易记录创建成功",
        data: { newTransactionId },
      });
    } catch (error) {
      next(error);
    }
  }

  // 获取用户的所有交易记录
  static async getUserTransactions(req, res, next) {
    try {
      // 解析查询参数
      const userId = parseInt(req.user.userId, 10);
      if (!userId) {
        throw new AppError("userId 是必填参数", 400);
      }

      const description = req.query.description || undefined;
      const typeId = req.query.typeId
        ? parseInt(req.query.typeId, 10)
        : undefined;
      const categoryId = req.query.categoryId
        ? parseInt(req.query.categoryId, 10)
        : undefined;
      const startDate = req.query.startDate || undefined;
      const endDate = req.query.endDate || undefined;

      // limit & offset 安全处理，避免 NaN
      const limit =
        parseInt(req.query.limit, 10) > 0 ? parseInt(req.query.limit, 10) : 10;
      const offset =
        parseInt(req.query.offset, 10) >= 0
          ? parseInt(req.query.offset, 10)
          : 0;

      // 调用 Model 层获取数据
      const transactions = await TransactionModel.getUserTransactions({
        userId,
        description,
        typeId,
        categoryId,
        startDate,
        endDate,
        limit,
        offset,
      });

      res.json({
        success: true,
        count: transactions.length,
        data: transactions,
      });
    } catch (error) {
      next(error); // 交给全局错误处理中间件
    }
  }

  // 获取特定交易记录
  static async getTransactionById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const transaction = await TransactionModel.getTransactionById(id, userId);
      if (!transaction) {
        throw new NotFoundError("未找到该交易记录");
      }

      res.json({
        code: 200,
        message: "获取交易记录成功",
        data: { transaction },
      });
    } catch (error) {
      next(error);
    }
  }

  // 更新交易记录
  static async updateTransaction(req, res, next) {
    try {
      let { id } = req.params;
      id = parseInt(id, 10);
      const { amount, typeId, categoryId, description, transactionDate } = req.body;
      const userId = req.user.userId;

      // 基本输入验证
      if (!amount || !typeId || !categoryId || !transactionDate) {
        throw new ValidationError("金额、类型、分类和交易日期为必填项");
      }

      // 更新交易记录
      const updated = await TransactionModel.updateTransaction(
        id,
        userId,
        amount,
        typeId,
        categoryId,
        description,
        transactionDate
      );

      if (updated) {
        res.json({ code: 200, message: "交易记录更新成功", data: null });
      } else {
        throw new NotFoundError("未找到该交易记录或无权修改");
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
        res.json({ code: 200, message: "交易记录删除成功", data: null });
      } else {
        throw new NotFoundError("未找到该交易记录或无权删除");
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TransactionController;
