// 简单测试脚本，用于验证修复是否成功
const db = require('./config/db');
const { setupDatabase } = require('./utils/dbSetup');

async function testFix() {
  try {
    console.log('测试数据库连接...');
    const connection = await db.getConnection();
    console.log('数据库连接成功');
    connection.release();

    console.log('测试数据库初始化...');
    await setupDatabase();
    console.log('数据库初始化成功');

    console.log('所有测试通过！');
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

testFix();