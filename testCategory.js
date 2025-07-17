const CategoryModel = require('./models/categoryModel');
const UserModel = require('./models/userModel');
const db = require('./config/db');

// 测试用户信息
const TEST_USER = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'testpassword'
};

// 测试用户ID (将在测试开始时创建)
let TEST_USER_ID = null;

// 测试分类数据
const testCategory = {
  name: '餐饮',
  type: 'expense',
  icon: '🍔'
};

// 测试更新后的分类数据
const updatedCategory = {
  name: '餐饮美食',
  type: 'expense',
  icon: '🍕'
};

// 测试函数
async function runTests() {
  let connection;
  try {
    console.log('===== 开始测试分类功能 =====');

    // 获取数据库连接
    connection = await db.getConnection();

    // 0. 准备测试环境 - 创建测试用户
    console.log('0. 准备测试环境 - 创建测试用户...');
    // 先删除可能存在的测试用户
    await connection.execute('DELETE FROM users WHERE username = ?', [TEST_USER.username]);
    // 创建新的测试用户
    const [result] = await connection.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [TEST_USER.username, TEST_USER.email, TEST_USER.password]
    );
    TEST_USER_ID = result.insertId;
    console.log(`创建测试用户成功，用户ID: ${TEST_USER_ID}`);

    // 1. 创建分类
    console.log('\n1. 创建分类...');
    const category = await CategoryModel.createCategory(
      TEST_USER_ID,
      testCategory.name,
      testCategory.type,
      testCategory.icon
    );
    console.log('创建成功:', category);
    const categoryId = category.id;

    // 2. 获取用户所有分类
    console.log('\n2. 获取用户所有分类...');
    const allCategories = await CategoryModel.getUserCategories(TEST_USER_ID);
    console.log('所有分类:', allCategories);

    // 3. 获取用户特定类型的分类
    console.log('\n3. 获取用户支出类型分类...');
    const expenseCategories = await CategoryModel.getUserCategoriesByType(
      TEST_USER_ID,
      'expense'
    );
    console.log('支出分类:', expenseCategories);

    // 4. 获取特定分类
    console.log('\n4. 获取特定分类...');
    const foundCategory = await CategoryModel.getCategoryById(
      TEST_USER_ID,
      categoryId
    );
    console.log('找到的分类:', foundCategory);

    // 5. 更新分类
    console.log('\n5. 更新分类...');
    const updated = await CategoryModel.updateCategory(
      TEST_USER_ID,
      categoryId,
      updatedCategory.name,
      updatedCategory.type,
      updatedCategory.icon
    );
    console.log('更新后的分类:', updated);

    // 6. 删除分类
    console.log('\n6. 删除分类...');
    const deleted = await CategoryModel.deleteCategory(TEST_USER_ID, categoryId);
    console.log('删除结果:', deleted ? '成功' : '失败');

    console.log('\n===== 测试完成 =====');
  } catch (error) {
    console.error('测试失败:', error.message);
    console.error(error.stack);
  } finally {
    // 清理测试数据
    if (TEST_USER_ID) {
      try {
        console.log('\n清理测试数据...');
        await connection.execute('DELETE FROM categories WHERE user_id = ?', [TEST_USER_ID]);
        await connection.execute('DELETE FROM users WHERE id = ?', [TEST_USER_ID]);
        console.log('测试数据清理完成');
      } catch (cleanupError) {
        console.error('清理测试数据失败:', cleanupError.message);
      }
    }

    // 释放连接
    if (connection) {
      connection.release();
    }

    // 关闭数据库连接池
    db.end();
  }
}

// 运行测试
runTests();