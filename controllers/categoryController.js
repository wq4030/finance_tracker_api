const CategoryModel = require("../models/categoryModel");

const { NotFoundError } = require("../middleware/errorMiddleware");

// 创建新分类
const createCategory = async (req, res, next) => {
  try {
    const { name, type, icon } = req.body;
    const userId = req.user.userId;

    const category = await CategoryModel.createCategory(
      userId,
      name,
      type,
      icon
    );
    res
      .status(201)
      .json({ code: 201, message: "分类创建成功", data: { category } });
  } catch (error) {
    next(error);
  }
};

// 获取用户的所有分类
const getUserCategories = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const categories = await CategoryModel.getUserCategories(userId);
    res
      .status(200)
      .json({ code: 200, message: "获取分类成功", data: { categories } });
  } catch (error) {
    next(error);
  }
};

// 获取用户特定类型的分类
const getUserCategoriesByType = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { type } = req.params;
    const categories = await CategoryModel.getUserCategoriesByType(
      userId,
      type
    );
    res
      .status(200)
      .json({ code: 200, message: "获取分类成功", data: { categories } });
  } catch (error) {
    next(error);
  }
};

// 获取特定分类
const getCategoryById = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const category = await CategoryModel.getCategoryById(userId, id);

    if (!category) {
      throw new NotFoundError("分类不存在");
    }

    res
      .status(200)
      .json({ code: 200, message: "获取分类成功", data: { category } });
  } catch (error) {
    next(error);
  }
};

// 更新分类
const updateCategory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { name, type, icon } = req.body;

    const updatedCategory = await CategoryModel.updateCategory(
      userId,
      id,
      name,
      type,
      icon
    );

    if (!updatedCategory) {
      throw new NotFoundError("分类不存在");
    }

    res
      .status(200)
      .json({
        code: 200,
        message: "分类更新成功",
        data: { category: updatedCategory },
      });
  } catch (error) {
    next(error);
  }
};

// 删除分类
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await CategoryModel.deleteCategory(id, userId);

    if (!result) {
      throw new NotFoundError("分类不存在");
    }

    res.status(200).json({ code: 200, message: "分类删除成功", data: null });
  } catch (error) {
    next(error);
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
