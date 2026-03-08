const teamService = require("../services/team.service");

const create = async (req, res) => {
  const result = await teamService.create(req.body);
  if (result.error) {
    return res.status(400).json({
      message: result.error || result.message,
    });
  }

  return res.status(201).json({
    message: "Team created successfully!!!",
    data: result.data,
  });
};

const findMany = async (req, res) => {
  const result = await teamService.findBy(req.body);
  if (result.error) {
    return res.status(400).json({
      message: result.error || result.message,
    });
  }

  return res.status(200).json({
    message: "Teams fetched successfully!!!",
    data: result.data,
  });
};

const find = async (req, res) => {
  const result = await teamService.findById(req.params.id);
  if (result.error) {
    return res.status(400).json({
      message: result.error || result.message,
    });
  }

  return res.status(200).json({
    message: "Team fetched successfully!!!",
    data: result.data,
  });
};

const update = async (req, res) => {
  const result = await teamService.update(req.params.id, req.body);
  if (result.error) {
    return res.status(400).json({
      message: result.error || result.message,
    });
  }

  return res.status(201).json({
    message: "Team updated successfully!!!",
    data: result.data,
  });
};

const remove = async (req, res) => {
  const result = await teamService.remove(req.params.id);
  if (result.error) {
    return res.status(400).json({
      message: result.error || result.message,
    });
  }

  return res.status(201).json({
    message: "Team deleted successfully!!!",
  });
};

module.exports = {
  create,
  findMany,
  find,
  update,
  remove,
};
