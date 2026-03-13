const betService = require("../services/bet.service");
const Bet = require("../models/Bet");

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

// NEW: place multiple bets from bet slip
const placeFromSlip = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware
    const result = await betService.placeFromSlip(userId, req.body);

    if (result.error) {
      // odds change, insufficient balance, invalid match, etc.
      return res.status(400).json({ message: result.error });
    }

    return res.status(201).json({
      message: "Bets placed successfully!!!",
      data: result.data,
    });
  } catch (error) {
    console.error("Error in placeFromSlip:", error);
    return res.status(500).json({
      message: "Internal Server Error, please retry later !!!",
    });
  }
};

const cashOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const betId = req.params.id;

    const result = await betService.cashOut(userId, betId);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    const cashOutAmount = result.data.cashOutAmount;
    const bet = result.data.bet; // whatever your service returns

    // Re-fetch the bet fully populated
    const populatedBet = await Bet.findById(bet._id).populate({
      path: "match",
      populate: [
        { path: "teamA", select: "name logo shortName code" },
        { path: "teamB", select: "name logo shortName code" },
        { path: "league", select: "name logo shortName country" },
        { path: "sport", select: "name logo slug" },
      ],
    });

    return res.status(200).json({
      message: "Bet cashed out successfully!!!",
      data: {
        cashOutAmount,
        bet: populatedBet,
      },
    });
  } catch (error) {
    console.error("Error in cashOut:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error, please retry later !!!" });
  }
};

// src/controllers/bet.controller.js
const findUserBets = async (req, res) => {
  try {
    const userId = req.user.id;

    const bets = await Bet.find({
      user: userId,
      status: { $in: ["pending", "open"] }, // adjust to your real statuses
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "match",
        populate: [
          { path: "teamA", select: "name logo shortName code" },
          { path: "teamB", select: "name logo shortName code" },
          { path: "league", select: "name logo shortName country" },
          { path: "sport", select: "name logo slug" },
        ],
      });

    return res.status(200).json({
      message: "Active user bets fetched successfully!!!",
      data: bets,
    });
  } catch (error) {
    console.error("Error fetching user bets:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error, please retry later !!!" });
  }
};

module.exports = {
  create,
  findMany,
  find,
  findUserBets,
  update,
  remove,
  placeFromSlip,
  cashOut,
};
