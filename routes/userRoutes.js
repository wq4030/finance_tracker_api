const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// 用户注册路由
router.post('/register', UserController.register);

// 用户登录路由
router.post('/login', UserController.login);

module.exports = router;