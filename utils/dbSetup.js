const { AppError } = require('../middleware/errorMiddleware');
const db = require('../config/db');

// 数据库初始化函数
async function setupDatabase() {
  let connection;
  try {
    // 获取连接
    connection = await db.getConnection();

    // 1. 创建users表
    await connection.execute(`
      CREATE table if not exists users (
        id int auto_increment primary key,
        username varchar(50) not null unique,
        email varchar(100) not null unique,
        password varchar(255) not null,
        created_at timestamp default current_timestamp,
        updated_at timestamp default current_timestamp on update current_timestamp
      )
    `);
    console.log('Users table created or already exists');

    // 2. 创建transaction_types表
    await connection.execute(`
      create table if not exists transaction_types (
        id int auto_increment primary key,
        name varchar(20) not null unique
      )
    `);
    console.log('Transaction types table created or already exists');

    // 插入交易类型
    await connection.execute(
      'insert ignore into transaction_types (name) values (?)',
      ['income']
    );
    await connection.execute(
      'insert ignore into transaction_types (name) values (?)',
      ['expense']
    );
    console.log('Transaction types inserted or already exist');

    // 3. 创建categories表
    await connection.execute(`
      CREATE TABLE if not exists categories (
        id int NOT NULL AUTO_INCREMENT,
        user_id int NOT NULL,
        name varchar(50) NOT NULL,
        type enum('income','expense') NOT NULL,
        icon varchar(100) DEFAULT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY user_id (user_id),
        CONSTRAINT categories_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
    console.log('Categories table created or already exists');

    // 4. 创建transactions表
    await connection.execute(`
      create table if not exists transactions (
        id int auto_increment primary key,
        user_id int not null,
        amount decimal(10, 2) not null,
        type_id int not null,
        category varchar(50) not null,
        description text,
        transaction_date date not null,
        created_at timestamp default current_timestamp,
        updated_at timestamp default current_timestamp on update current_timestamp,
        foreign key (user_id) references users(id) on delete cascade,
        foreign key (type_id) references transaction_types(id)
      )
    `);
    console.log('Transactions table created or already exists');

    console.log('Database setup completed successfully');
  } catch (error) {
    throw new AppError(`Database setup failed: ${error.message}`, 500);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// 如果直接运行此脚本，则执行数据库初始化
if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err.message);
      process.exit(1);
    });
}

module.exports = { setupDatabase };