# 个人记账管理系统API文档

## 项目概述
这是一个基于Express开发的个人记账管理系统后端API，提供用户认证、交易记录管理和分类管理等功能。

## 技术栈
- Express：Web框架
- MySQL2：数据库驱动
- JWT：用户认证
- Bcryptjs：密码加密
- Dotenv：环境变量管理

## 认证说明
除了用户注册和登录接口外，其他所有接口都需要认证。认证方式为JWT令牌认证，在请求头中添加：
```
Authorization: Bearer {token}
```

令牌有效期为24小时，过期后需要重新登录获取新令牌。

## API端点

### 用户相关

#### 用户注册
- **URL**: `/api/users/register`
- **方法**: `POST`
- **描述**: 创建新用户
- **请求体**: 
  ```json
  {
    "username": "string", // 用户名，必填
    "email": "string",    // 邮箱，必填
    "password": "string"  // 密码，必填
  }
  ```
- **成功响应**: 
  ```json
  {
    "code": 201,
    "message": "用户注册成功",
    "data": {
      "user": {
        "id": "number",
        "username": "string",
        "email": "string",
        "created_at": "datetime"
      }
    }
  }
  ```
- **错误响应**: 
  ```json
  {
    "code": 400,
    "message": "用户名已被注册",
    "data": null
  }
  ```

#### 用户登录
- **URL**: `/api/users/login`
- **方法**: `POST`
- **描述**: 用户登录并获取认证令牌
- **请求体**: 
  ```json
  {
    "username": "string", // 用户名，必填
    "password": "string"  // 密码，必填
  }
  ```
- **成功响应**: 
  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "token": "string", // JWT令牌
      "user": {
        "user_id": "number",
        "username": "string",
        "email": "string"
      }
    }
  }
  ```
- **错误响应**: 
  ```json
  {
    "code": 404,
    "message": "用户名或密码错误",
    "data": null
  }
  ```

### 交易相关（需要认证）

#### 创建交易记录
- **URL**: `/api/transactions`
- **方法**: `POST`
- **描述**: 创建新的交易记录
- **请求体**: 
  ```json
  {
    "amount": "number",       // 金额，必填
    "type": "string",         // 类型，只能是'income'或'expense'，必填
    "category": "number",     // 分类ID，必填
    "description": "string",  // 描述，选填
    "transactionDate": "date" // 交易日期，格式YYYY-MM-DD，必填
  }
  ```
- **成功响应**: 
  ```json
  {
    "code": 201,
    "message": "交易记录创建成功",
    "data": {
      "transaction": {
        "id": "number",
        "user_id": "number",
        "amount": "number",
        "type": "string",
        "category": "number",
        "description": "string",
        "transaction_date": "date",
        "created_at": "datetime"
      }
    }
  }
  ```
- **错误响应**: 
  ```json
  {
    "code": 400,
    "message": "金额、类型、分类和交易日期为必填项",
    "data": null
  }
  ```

#### 获取所有交易记录
- **URL**: `/api/transactions`
- **方法**: `GET`
- **描述**: 获取当前用户的所有交易记录
- **成功响应**: 
  ```json
  {
    "code": 200,
    "message": "获取交易记录成功",
    "data": {
      "transactions": [
        {
          "id": "number",
          "user_id": "number",
          "amount": "number",
          "type": "string",
          "category": "number",
          "description": "string",
          "transaction_date": "date",
          "created_at": "datetime"
        }
      ]
    }
  }
  ```

#### 获取特定交易记录
- **URL**: `/api/transactions/:id`
- **方法**: `GET`
- **描述**: 获取指定ID的交易记录
- **参数**: 
  - `id`: 交易记录ID
- **成功响应**: 
  ```json
  {
    "code": 200,
    "message": "获取交易记录成功",
    "data": {
      "transaction": {
        "id": "number",
        "user_id": "number",
        "amount": "number",
        "type": "string",
        "category": "number",
        "description": "string",
        "transaction_date": "date",
        "created_at": "datetime"
      }
    }
  }
  ```
- **错误响应**: 
  ```json
  {
    "code": 404,
    "message": "未找到该交易记录",
    "data": null
  }
  ```

#### 更新交易记录
- **URL**: `/api/transactions/:id`
- **方法**: `PUT`
- **描述**: 更新指定ID的交易记录
- **参数**: 
  - `id`: 交易记录ID
- **请求体**: 
  ```json
  {
    "amount": "number",       // 金额，必填
    "type": "string",         // 类型，只能是'income'或'expense'，必填
    "category": "number",     // 分类ID，必填
    "description": "string",  // 描述，选填
    "transactionDate": "date" // 交易日期，格式YYYY-MM-DD，必填
  }
  ```
- **成功响应**: 
  ```json
  {
    "code": 200,
    "message": "交易记录更新成功",
    "data": null
  }
  ```
- **错误响应**: 
  ```json
  {
    "code": 404,
    "message": "未找到该交易记录或无权修改",
    "data": null
  }
  ```

#### 删除交易记录
- **URL**: `/api/transactions/:id`
- **方法**: `DELETE`
- **描述**: 删除指定ID的交易记录
- **参数**: 
  - `id`: 交易记录ID
- **成功响应**: 
  ```json
  {
    "code": 200,
    "message": "交易记录删除成功",
    "data": null
  }
  ```
- **错误响应**: 
  ```json
  {
    "code": 404,
    "message": "未找到该交易记录或无权删除",
    "data": null
  }
  ```

### 分类相关（需要认证）

#### 创建分类
- **URL**: `/api/categories`
- **方法**: `POST`
- **描述**: 创建新的分类
- **请求体**: 
  ```json
  {
    "name": "string",  // 分类名称，必填
    "type": "string",  // 类型，只能是'income'或'expense'，必填
    "icon": "string"   // 图标，选填
  }
  ```
- **成功响应**: 
  ```json
  {
    "code": 201,
    "message": "分类创建成功",
    "data": {
      "category": {
        "id": "number",
        "user_id": "number",
        "name": "string",
        "type": "string",
        "icon": "string",
        "created_at": "datetime"
      }
    }
  }
  ```

#### 获取所有分类
- **URL**: `/api/categories`
- **方法**: `GET`
- **描述**: 获取当前用户的所有分类
- **成功响应**: 
  ```json
  {
    "code": 200,
    "message": "获取分类成功",
    "data": {
      "categories": [
        {
          "id": "number",
          "user_id": "number",
          "name": "string",
          "type": "string",
          "icon": "string",
          "created_at": "datetime"
        }
      ]
    }
  }
  ```

#### 获取特定类型的分类
- **URL**: `/api/categories/type/:type`
- **方法**: `GET`
- **描述**: 获取当前用户特定类型的分类
- **参数**: 
  - `type`: 分类类型，只能是'income'或'expense'
- **成功响应**: 
  ```json
  {
    "code": 200,
    "message": "获取分类成功",
    "data": {
      "categories": [
        {
          "id": "number",
          "user_id": "number",
          "name": "string",
          "type": "string",
          "icon": "string",
          "created_at": "datetime"
        }
      ]
    }
  }
  ```

#### 获取特定分类
- **URL**: `/api/categories/:id`
- **方法**: `GET`
- **描述**: 获取指定ID的分类
- **参数**: 
  - `id`: 分类ID
- **成功响应**: 
  ```json
  {
    "code": 200,
    "message": "获取分类成功",
    "data": {
      "category": {
        "id": "number",
        "user_id": "number",
        "name": "string",
        "type": "string",
        "icon": "string",
        "created_at": "datetime"
      }
    }
  }
  ```
- **错误响应**: 
  ```json
  {
    "code": 404,
    "message": "分类不存在",
    "data": null
  }
  ```

#### 更新分类
- **URL**: `/api/categories/:id`
- **方法**: `PUT`
- **描述**: 更新指定ID的分类
- **参数**: 
  - `id`: 分类ID
- **请求体**: 
  ```json
  {
    "name": "string",  // 分类名称，必填
    "type": "string",  // 类型，只能是'income'或'expense'，必填
    "icon": "string"   // 图标，选填
  }
  ```
- **成功响应**: 
  ```json
  {
    "code": 200,
    "message": "分类更新成功",
    "data": {
      "category": {
        "id": "number",
        "user_id": "number",
        "name": "string",
        "type": "string",
        "icon": "string",
        "updated_at": "datetime"
      }
    }
  }
  ```
- **错误响应**: 
  ```json
  {
    "code": 404,
    "message": "分类不存在",
    "data": null
  }
  ```

#### 删除分类
- **URL**: `/api/categories/:id`
- **方法**: `DELETE`
- **描述**: 删除指定ID的分类
- **参数**: 
  - `id`: 分类ID
- **成功响应**: 
  ```json
  {
    "code": 200,
    "message": "分类删除成功",
    "data": null
  }
  ```
- **错误响应**: 
  ```json
  {
    "code": 404,
    "message": "分类不存在",
    "data": null
  }
  ```

## API使用流程示例
1. **注册用户**：发送POST请求到`/api/users/register`创建新用户
2. **用户登录**：发送POST请求到`/api/users/login`获取JWT令牌
3. **访问受保护资源**：在请求头中添加`Authorization: Bearer {token}`，然后访问需要认证的接口
4. **创建分类**：发送POST请求到`/api/categories`创建收入或支出分类
5. **创建交易**：发送POST请求到`/api/transactions`记录收入或支出
6. **查询和管理**：使用GET、PUT、DELETE请求查询和管理交易和分类

## 常见问题解答
1. **Q: 令牌过期怎么办？**
   A: 重新登录获取新的令牌。

2. **Q: 如何处理分类和交易的关系？**
   A: 每个交易必须关联一个分类，创建交易前请先创建分类。

3. **Q: 交易类型有哪些限制？**
   A: 交易类型只能是'income'（收入）或'expense'（支出）。

4. **Q: 如何确保API的安全性？**
   A: 所有敏感接口都需要JWT认证，密码使用bcrypt加密存储，请勿泄露您的令牌。

## 错误码说明
| 状态码 | 描述 |
|--------|------|
| 200    | 请求成功 |
| 201    | 创建成功 |
| 400    | 请求参数错误 |
| 401    | 未授权访问 |
| 403    | 禁止访问 |
| 404    | 资源未找到 |
| 500    | 服务器内部错误 |