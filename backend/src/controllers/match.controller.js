const matchService = require("../services/match.service");
const Match = require("../models/Match");

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
  try {
    const { sport, status, leagueId } = req.query;

    const filter = {};
    if (sport) {
      filter.sport = sport; // ObjectId as string
    }
    if (status) {
      filter.status = status; // "upcoming" | "ongoing" | "finished"
    }
    if (leagueId) {
      filter.league = leagueId; // ObjectId as string
    }

    const matches = await Match.find(filter)
      .populate("league", "name logo")
      .populate("teamA", "name logo")
      .populate("teamB", "name logo")
      .sort({ startTime: 1 });

    return res.status(200).json({
      message: "Matches fetched successfully!!!",
      data: matches,
    });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return res.status(500).json({
      message: "Internal Server Error, please retry later !!!",
    });
  }
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
