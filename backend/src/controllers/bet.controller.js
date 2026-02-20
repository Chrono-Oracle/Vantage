const betService = require("../services/bet.service");

const create = async (req, res) => {
  const result = await betService.create(req.body);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(201).json({
    message: "Bet created successfully!!!",
  });
};

const findMany = async (req, res) => {
  const result = await betService.findBy(req.body);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(201).json({
    message: "Bets fetched successfully!!!",
  });
};

const find = async (req, res) => {
  const result = await betService.findBy(req.params.id);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(201).json({
    message: "Bet fetched successfully!!!",
  });
};

const update = async (req, res) => {
  const result = await betService.update(req.params.id, req.body);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(201).json({
    message: "Bet updated successfully!!!",
  });
};

const remove = async (req, res) => {
  const result = await betService.remove(req.params.id);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(201).json({
    message: "Bet deleted successfully!!!",
  });
};

module.exports = {
  create,
  findMany,
  find,
  update,
  remove,
};
