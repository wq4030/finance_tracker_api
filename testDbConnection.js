const db = require('./config/db');

async function testDbConnection() {
  try {
    console.log('测试数据库连接...');
    const connection = await db.getConnection();
    console.log('数据库连接成功');

    // 检查 transaction_types 表是否存在
    const [tables] = await connection.execute(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'transaction_types'"
    );
    if (tables.length === 0) {
      console.error('错误: transaction_types 表不存在');
    } else {
      console.log('transaction_types 表存在');
      // 检查表结构
      const [columns] = await connection.execute(
        "SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'transactions' AND column_name = 'type_id'"
      );
      if (columns.length === 0) {
        console.error('错误: transactions 表中不存在 type_id 列');
      } else {
        console.log('transactions 表中存在 type_id 列');
      }
    }

    connection.release();
  } catch (error) {
    console.error('数据库操作失败:', error.message);
  }
}

testDbConnection();