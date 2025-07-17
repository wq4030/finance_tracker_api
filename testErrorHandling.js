const { setupDatabase } = require('./utils/dbSetup');
const UserModel = require('./models/userModel');
const TransactionModel = require('./models/transactionModel');
const { AppError, ValidationError, NotFoundError } = require('./middleware/errorMiddleware');
const { setupDatabase } = require('./utils/dbSetup');
require('dotenv').config();

// 测试函数
async function runTests() {
  try {
    console.log('开始测试...');

    // 1. 测试数据库初始化
    console.log('测试 1: 数据库初始化');
    await setupDatabase();
    console.log('数据库初始化成功');

    // 2. 测试用户注册 - 成功案例
    console.log('\n测试 2: 用户注册 - 成功案例');
    const newUser = await UserModel.createUser('testuser', 'test@example.com', 'password123');
    console.log('用户注册成功:', newUser);

    // 3. 测试用户注册 - 用户名重复
    console.log('\n测试 3: 用户注册 - 用户名重复');
    try {
      await UserModel.createUser('testuser', 'another@example.com', 'password456');
      console.log('测试失败: 应该抛出用户名已被注册的错误');
    } catch (error) {
      if (error instanceof ValidationError && error.message === '用户名已被注册') {
        console.log('测试成功: 正确捕获到用户名重复错误');
      } else {
        console.log('测试失败: 抛出了错误但类型或消息不正确');
        console.error(error);
      }
    }

    // 4. 测试用户注册 - 邮箱重复
    console.log('\n测试 4: 用户注册 - 邮箱重复');
    try {
      await UserModel.createUser('anotheruser', 'test@example.com', 'password789');
      console.log('测试失败: 应该抛出邮箱已被注册的错误');
    } catch (error) {
      if (error instanceof ValidationError && error.message === '邮箱已被注册') {
        console.log('测试成功: 正确捕获到邮箱重复错误');
      } else {
        console.log('测试失败: 抛出了错误但类型或消息不正确');
        console.error(error);
      }
    }

    // 5. 测试获取不存在的用户
    console.log('\n测试 5: 获取不存在的用户');
    const nonExistentUser = await UserModel.getUserByUsername('nonexistent');
    if (nonExistentUser === null) {
      console.log('测试成功: 正确返回 null');
    } else {
      console.log('测试失败: 应该返回 null');
    }

    // 6. 测试创建交易 - 无效类型
    console.log('\n测试 6: 创建交易 - 无效类型');
    try {
      await TransactionModel.createTransaction(
        newUser.id, 100, 'invalid_type', 'Food', 'Lunch', '2023-10-01'
      );
      console.log('测试失败: 应该抛出无效交易类型的错误');
    } catch (error) {
      if (error instanceof AppError && error.message === '无效的交易类型') {
        console.log('测试成功: 正确捕获到无效交易类型错误');
      } else {
        console.log('测试失败: 抛出了错误但类型或消息不正确');
        console.error(error);
      }
    }

    // 7. 测试创建交易 - 成功案例
    console.log('\n测试 7: 创建交易 - 成功案例');
    const newTransaction = await TransactionModel.createTransaction(
      newUser.id, 100, 'income', 'Salary', 'Monthly salary', '2023-10-01'
    );
    console.log('交易创建成功:', newTransaction);

    // 8. 测试获取不存在的交易
    console.log('\n测试 8: 获取不存在的交易');
    const nonExistentTransaction = await TransactionModel.getTransactionById(newUser.id, 9999);
    if (nonExistentTransaction === null) {
      console.log('测试成功: 正确返回 null');
    } else {
      console.log('测试失败: 应该返回 null');
    }

    console.log('\n所有测试完成');
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

// 运行测试
runTests();