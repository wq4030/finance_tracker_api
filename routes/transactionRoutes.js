const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 应用认证中间件保护所有交易路由
router.use(authenticateToken);

// 创建新交易记录
router.post('/', TransactionController.createTransaction);

// 获取用户的所有交易记录
router.get('/', TransactionController.getUserTransactions);

// 获取特定交易记录
router.get('/:id', TransactionController.getTransactionById);

// 更新交易记录
router.put('/:id', TransactionController.updateTransaction);

// 删除交易记录
router.delete('/:id', TransactionController.deleteTransaction);

module.exports = router;