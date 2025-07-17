const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 应用认证中间件保护所有交易路由
router.use(authenticateToken);

// 创建新分类
router.post('/', categoryController.createCategory);

// 获取用户的所有分类
router.get('/', categoryController.getUserCategories);

// 获取用户特定类型的分类
router.get('/type/:type', categoryController.getUserCategoriesByType);

// 获取特定分类
router.get('/:id', categoryController.getCategoryById);

// 更新分类
router.put('/:id', categoryController.updateCategory);

// 删除分类
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;