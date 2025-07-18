const pool = require("../config/db");

/**
 * 封装数据库查询执行函数，自动处理参数校验和错误处理
 * @param {string} sql - SQL查询语句
 * @param {Array} values - 参数数组
 * @returns {Promise} - 返回查询结果
 */
async function executeQuery(sql, values = []) {
  console.log(sql, values);
  try {
    // 校验并转换参数：将undefined转换为null
    const processedValues = values.map((value) =>
      value === undefined ? null : value
    );

    // 执行SQL查询
    const [rows, fields] = await pool.execute(sql, processedValues);
    return rows;
  } catch (error) {
    console.error("数据库查询错误:", error);
    // 重新抛出错误，让调用者处理
    throw error;
  }
}

module.exports = {
  executeQuery,
};
