const userService = require("..services/user.service");

const create = async (req, res) => {
  const result = await userService.create(req.body);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return (
    res.status(201),
    json({
      message: "User Created Successfully!!!",
    })
  );
};

const findMany = async (req, res) => {
  const result = await userService.findBy(req.body);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(201).json({
    message: "Users fetched successfully!!!",
  });
};

const find = async (req, res) => {
  const result = await userService.findBy(req.params.id);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(201).json({
    message: "User fetched successfully!!!",
  });
};

const update = async (req, res) => {
  const result = await userService.update(req.params.id, req.body);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(201).json({
    message: "User updated successfully!!!",
  });
};

const remove = async (req, res) => {
  const result = await userService.remove(req.params.id);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(201).json({
    message: "User deleted successfully!!!",
  });
};

module.exports = {
  create,
  findMany,
  find,
  update,
  remove,
};
