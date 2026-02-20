const matchService = require("../services/match.service");

const create = async (req, res) => {
  const result = await matchService.create(req.body);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(201).json({
    message: "Match created successfully!!!",
  });
};

const findMany = async (req, res) => {
  const result = await matchService.findBy(req.body);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(201).json({
    message: "Matches fetched successfully!!!",
  });
};

const find = async (req, res) => {
  const result = await matchService.findBy(req.params.id);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(201).json({
    message: "Match fetched successfully!!!",
  });
};

const update = async (req, res) => {
  const result = await matchService.update(req.params.id, req.body);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(201).json({
    message: "Match updated successfully!!!",
  });
};

const remove = async (req, res) => {
  const result = await matchService.remove(req.params.id);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(201).json({
    message: "Match deleted successfully!!!",
  });
};

module.exports = {
  create,
  findMany,
  find,
  update,
  remove,
};
