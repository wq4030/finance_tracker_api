const CategoryModel = require('../models/categoryModel');

// 创建新分类
const createCategory = async (req, res) => {
  try {
    const { name, type, icon } = req.body;
    const userId = req.user.userId;

    const category = await CategoryModel.createCategory(userId, name, type, icon);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 获取用户的所有分类
const getUserCategories = async (req, res) => {
  try {
    const userId = req.user.userId;
    const categories = await CategoryModel.getUserCategories(userId);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 获取用户特定类型的分类
const getUserCategoriesByType = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type } = req.params;
    const categories = await CategoryModel.getUserCategoriesByType(userId, type);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 获取特定分类
const getCategoryById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const category = await CategoryModel.getCategoryById(userId, id);

    if (!category) {
      return res.status(404).json({ message: '分类不存在' });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 更新分类
const updateCategory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { name, type, icon } = req.body;

    const updatedCategory = await CategoryModel.updateCategory(userId, id, name, type, icon);

    if (!updatedCategory) {
      return res.status(404).json({ message: '分类不存在' });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 删除分类
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await CategoryModel.deleteCategory(id, userId);

    if (!result) {
      return res.status(404).json({ message: '分类不存在' });
    }

    res.status(200).json({ message: '分类删除成功' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCategory,
  getUserCategories,
  getUserCategoriesByType,
  getCategoryById,
  updateCategory,
  deleteCategory,
};