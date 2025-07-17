# 个人记账管理系统后端

这是一个基于Express开发的个人记账管理系统后端API，使用MySQL数据库存储数据。

## 技术栈
- Express：Web框架
- MySQL2：数据库驱动
- CORS：跨域处理
- JSON Web Token：用户认证
- Bcryptjs：密码加密
- Dotenv：环境变量管理

## 项目结构
```
finance_tracker_api/
├── .env                    # 环境变量配置
├── app.js                  # 应用入口文件
├── config/                 # 配置文件目录
│   └── db.js               # 数据库配置
├── controllers/            # 控制器目录
│   ├── userController.js   # 用户控制器
│   └── transactionController.js  # 交易控制器
├── middleware/             # 中间件目录
│   └── authMiddleware.js   # JWT认证中间件
├── models/                 # 模型目录
│   ├── userModel.js        # 用户模型
│   └── transactionModel.js # 交易模型
├── routes/                 # 路由目录
│   ├── userRoutes.js       # 用户路由
│   └── transactionRoutes.js # 交易路由
├── utils/                  # 工具目录
│   └── dbSetup.js          # 数据库初始化脚本
├── test.http               # API测试文件
└── README.md               # 项目说明
```

## 环境配置
1. 复制`.env.example`文件并重命名为`.env`
2. 修改`.env`文件中的数据库配置和JWT密钥

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=finance_tracker
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

## 数据库初始化
1. 确保MySQL服务已启动
2. 创建数据库：`CREATE DATABASE finance_tracker;`
3. 运行数据库初始化脚本：`node utils/dbSetup.js`

## 启动服务器
```
node app.js
```

## API测试
使用VS Code的REST Client扩展或其他API测试工具打开`test.http`文件进行测试。
1. 首先运行用户注册请求
2. 然后运行用户登录请求获取token
3. 将获取到的token替换到其他请求的Authorization头中
4. 测试其他交易相关的API端点

## API端点
### 用户相关
- `POST /api/users/register`：用户注册
- `POST /api/users/login`：用户登录

### 交易相关（需要认证）
- `POST /api/transactions`：创建交易记录
- `GET /api/transactions`：获取所有交易记录
- `GET /api/transactions/:id`：获取特定交易记录
- `PUT /api/transactions/:id`：更新交易记录
- `DELETE /api/transactions/:id`：删除交易记录