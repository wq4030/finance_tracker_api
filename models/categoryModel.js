const { executeQuery } = require('../utils/dbUtils');

class CategoryModel {
  /**
   * 创建新分类
   * @param {number} userId - 用户ID
   * @param {string} name - 分类名称
   * @param {string} type - 分类类型（收入或支出）
   * @param {string|null} [icon=null] - 分类图标（可选）
   * @returns {Promise<Object>} 创建的分类对象
   */
  static async createCategory(userId, name, type, icon = null) {
    try {
      const result = await executeQuery(
        'INSERT INTO categories (user_id, name, type, icon) VALUES (?, ?, ?, ?)',
        [userId, name, type, icon]
      );

      const category = await executeQuery(
        'SELECT * FROM categories WHERE id = ?',
        [result.insertId]
      );

      return category[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取用户的所有分类
   * @param {number} userId - 用户ID
   * @returns {Promise<Array>} 分类数组
   */
  static async getUserCategories(userId) {
    try {
      const categories = await executeQuery(
        'SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC',
        [userId]
      );
      return categories;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取用户特定类型的分类
   * @param {number} userId - 用户ID
   * @param {string} type - 分类类型（收入或支出）
   * @returns {Promise<Array>} 分类数组
   */
  static async getUserCategoriesByType(userId, type) {
    try {
      const categories = await executeQuery(
        'SELECT * FROM categories WHERE user_id = ? AND type = ? ORDER BY name ASC',
        [userId, type]
      );
      return categories;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取特定分类
   * @param {number} userId - 用户ID
   * @param {number} categoryId - 分类ID
   * @returns {Promise<Object|null>} 分类对象或null（如果不存在）
   */
  static async getCategoryById(userId, categoryId) {
    try {
      const categories = await executeQuery(
        'SELECT * FROM categories WHERE id = ? AND user_id = ?',
        [categoryId, userId]
      );
      return categories[0] || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 更新分类
   * @param {number} userId - 用户ID
   * @param {number} categoryId - 分类ID
   * @param {string} name - 新的分类名称
   * @param {string} type - 新的分类类型
   * @param {string|null} [icon=null] - 新的分类图标（可选）
   * @returns {Promise<Object|null>} 更新后的分类对象或null（如果不存在）
   */
  static async updateCategory(userId, categoryId, name, type, icon = null) {
    try {
      await executeQuery(
        'UPDATE categories SET name = ?, type = ?, icon = ? WHERE id = ? AND user_id = ?',
        [name, type, icon, categoryId, userId]
      );

      const category = await executeQuery(
        'SELECT * FROM categories WHERE id = ? AND user_id = ?',
        [categoryId, userId]
      );

      return category[0] || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 删除分类
   * @param {number} categoryId - 分类ID
   * @param {number} userId - 用户ID
   * @returns {Promise<boolean>} 是否删除成功
   */
  static async deleteCategory(categoryId, userId) {
    try {
      const result = await executeQuery(
        'DELETE FROM categories WHERE id = ? AND user_id = ?',
        [categoryId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CategoryModel;