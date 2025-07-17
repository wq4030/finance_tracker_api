// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // 默认错误状态码和消息
  let statusCode = 500;
  let errorMessage = '服务器内部错误';

  // 根据错误类型设置不同的状态码和消息
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorMessage = err.message; // 直接使用错误消息
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    errorMessage = err.message || '未授权访问';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    errorMessage = err.message || '禁止访问';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    errorMessage = err.message || '请求的资源不存在';
  } else if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 400;
    errorMessage = '数据已存在';
  } else if (err.message) {
    errorMessage = err.message;
  }

  // 根据环境返回不同级别的错误信息
  if (process.env.NODE_ENV === 'development') {
    // 开发环境返回详细错误信息
    return res.status(statusCode).json({
      code: statusCode,
      message: errorMessage,
      data: null,
      stack: err.stack
    });
  }

  // 生产环境只返回基本错误信息
  res.status(statusCode).json({
    code: statusCode,
    message: errorMessage,
    data: null
  });
};

// 自定义错误类
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message) {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message) {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
  }
}

module.exports = {
  errorHandler,
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError
}
