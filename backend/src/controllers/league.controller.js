const leagueService = require("../services/league.service");

const create = async (req, res) => {
  const result = await leagueService.create(req.body);
  if (result.error) {
    return res.status(400).json({
      message: result.error || result.message,
    });
  }

  return res.status(201).json({
    message: "League created successfully!!!",
    data: result.data,
  });
};

const findMany = async (req, res) => {
  try {
    const { sport } = req.query; // sport ObjectId as string

    const filter = {};
    if (sport) {
      filter.sport = sport;
    }

    const result = await leagueService.find(filter);

    if (result.error) {
      return res.status(400).json({
        message: result.message || result.error,
      });
    }

    return res.status(200).json({
      message: "Leagues fetched successfully!!!",
      data: result.data,
    });
  } catch (error) {
    console.error("Error in league findMany:", error);
    return res.status(500).json({
      message: "Internal Server Error, please retry later !!!",
    });
  }
};

const find = async (req, res) => {
  const result = await leagueService.findById(req.params.id);
  if (result.error) {
    return res.status(400).json({
      message: result.error || result.message,
    });
  }

  return res.status(200).json({
    message: "League fetched successfully!!!",
    data: result.data,
  });
};

const update = async (req, res) => {
  const result = await leagueService.update(req.params.id, req.body);
  if (result.error) {
    return res.status(400).json({
      message: result.error || result.message,
    });
  }

  return res.status(201).json({
    message: "League updated successfully!!!",
    data: result.data,
  });
};

const remove = async (req, res) => {
  const result = await leagueService.remove(req.params.id);
  if (result.error) {
    return res.status(400).json({
      message: result.error || result.message,
    });
  }

  return res.status(201).json({
    message: "League deleted successfully!!!",
  });
};

module.exports = {
  create,
  findMany,
  find,
  update,
  remove,
};
