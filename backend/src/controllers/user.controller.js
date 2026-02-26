const userService = require("../services/user.service");

const create = async (req, res) => {
  const result = await userService.create(req.body);

  console.log("Result from userService.create:", result);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return (
    res.status(201).json({
      message: "User Created Successfully!!!",
    })
  );
};

const findMany = async (req, res) => {
  const result = await userService.find({});
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(200).json({
    message: "Users fetched successfully!!!",
    data: result.data,
  });
};

const find = async (req, res) => {
  const result = await userService.findById(req.params.id);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(200).json({
    message: "User fetched successfully!!!",
    data: result.data,
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

const login = async (req, res) => {
  const result = await userService.login(req.body);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(200).json({
    message: "User logged in successfully!!!",
    data: result,
  });
};

const profile = async (req, res) => {
  const result = await userService.findById(req.user.id);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(200).json({
    message: "User profile fetched successfully!!!",
    data: result,
  });
};

module.exports = {
  create,
  findMany,
  find,
  update,
  remove,
  login,
  profile,
};
