const categoryService = require("../services/category.service");

const create = async (req, res) => {
  const result = await categoryService.create(req.body);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(201).json({
    message: "Category created successfully!!!",
  });
};

const findMany = async (req, res) => {
  const result = await categoryService.findBy(req.body);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(201).json({
    message: "Caregories fetched successfully!!!",
  });
};

const find = async (req, res) => {
  const result = await categoryService.findBy(req.params.id);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(201).json({
    message: "Category fetched successfully!!!",
  });
};

const update = async (req, res) => {
  const result = await categoryService.update(req.params.id, req.body);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(201).json({
    message: "Category updated successfully!!!",
  });
};

const remove = async (req, res) => {
  const result = await categoryService.remove(req.params.id);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(201).json({
    message: "Category deleted successfully!!!",
  });
};

module.exports = {
  create,
  findMany,
  find,
  update,
  remove,
};
