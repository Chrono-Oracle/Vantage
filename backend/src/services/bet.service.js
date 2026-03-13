const Bet = require("../models/Bet");
const BaseService = require("./base.service");
const userService = require("./user.service");
const Match = require("../models/Match");
const User = require("../models/User");

// Map "1","X","2" -> Match.odds keys
const choiceToOddsKey = (choice) => {
  if (choice === "1") return "home";
  if (choice === "2") return "away";
  if (choice === "X") return "draw";
  throw new Error("Invalid choice");
};

class BetService extends BaseService {
  constructor() {
    super(Bet);
  }

  // Single bet placement (you already had this)
  async placeBet(userId, betData) {
    const user = await userService.findById(userId);
    if (user.wallet.balance < betData.stake) {
      throw new Error("Insufficient balance");
    }

    const match = await Match.findById(betData.matchId);
    if (match.status !== "upcoming") {
      throw new Error("Betting is closed for this match");
    }

    // Deduct stake and create bet
    user.wallet.balance -= betData.stake;
    await user.save();

    return await this.model.create({
      user: userId,
      ...betData,
      status: "pending",
    });
  }

  // NEW: place multiple single bets from a bet slip
  async placeFromSlip(userId, { items, stakePerBet }) {
    if (!items || !items.length) {
      return { error: "Bet slip is empty" };
    }
    if (!stakePerBet || stakePerBet <= 0) {
      return { error: "Invalid stake" };
    }

    // 1) Get user (wrapped) just to read balance
    const userResult = await userService.findById(userId);
    if (userResult.error) {
      return { error: userResult.error };
    }

    const userData = userResult.data; // plain object
    const totalStake = stakePerBet * items.length;

    if (!userData.wallet || userData.wallet.balance == null) {
      return { error: "User wallet not found" };
    }

    if (userData.wallet.balance < totalStake) {
      return { error: "Insufficient balance for all bets" };
    }

    const preparedBets = [];

    // 2) Validate all selections first
    for (const item of items) {
      const { matchId, choice, odds: clientOdds } = item;

      if (!["1", "X", "2"].includes(choice)) {
        return { error: "Invalid choice" };
      }

      const match = await Match.findById(matchId);
      if (!match) {
        return { error: "Match not found" };
      }

      if (match.status !== "upcoming") {
        return { error: "Match is not open for betting" };
      }

      if (match.startTime <= new Date()) {
        return { error: "Match already started" };
      }

      const oddsKey = choiceToOddsKey(choice);
      const currentOdds = match.odds[oddsKey];

      if (!currentOdds || currentOdds <= 1) {
        return { error: "Invalid or unavailable odds for this selection" };
      }

      if (
        typeof clientOdds === "number" &&
        Math.abs(currentOdds - clientOdds) > 0.0001
      ) {
        return { error: "Odds changed, please refresh your slip" };
      }

      const potentialPayout = stakePerBet * currentOdds;

      preparedBets.push({
        user: userId,
        match: match._id,
        choice,
        stake: stakePerBet,
        oddsAtPlacement: currentOdds,
        potentialPayout,
        status: "pending",
        xpEarned: 0,
      });
    }

    // 3) Now fetch real Mongoose user and deduct balance ONCE
    const mongooseUser = await require("../models/User").findById(userId);
    if (!mongooseUser) {
      return { error: "User not found" };
    }

    if (mongooseUser.wallet.balance < totalStake) {
      return { error: "Insufficient balance for all bets" };
    }

    // Deduct balance
    mongooseUser.wallet.balance -= totalStake;

    // NEW: increment totalBetsPlaced by number of bets in this slip
    mongooseUser.totalBetsPlaced =
      (mongooseUser.totalBetsPlaced || 0) + items.length;

    await mongooseUser.save();

    // 4) Create all bets
    const createdBets = await this.model.insertMany(preparedBets);

    return { data: createdBets };
  }

  async settleMatchBets(matchId, finalResult) {
    const bets = await this.model.find({ match: matchId, status: "pending" });

    for (let bet of bets) {
      const isWin = bet.choice === finalResult;

      // XP logic: you already have this set up via userService.updateXP
      const xpResult = await userService.updateXP(bet.user, 100, isWin);

      if (isWin) {
        // Pay out wallet
        await userService.updateWallet(bet.user, bet.potentialPayout);
        bet.status = "won";
      } else {
        bet.status = "lost";
      }

      bet.xpEarned = xpResult.data.xpGained;
      bet.settledAt = new Date();
      await bet.save();
    }
  }

  async cashOut(userId, betId) {
    const bet = await Bet.findById(betId);
    if (!bet) return { error: "Bet not found" };

    if (bet.user.toString() !== userId.toString()) {
      return { error: "You are not allowed to cash out this bet" };
    }

    if (bet.status !== "pending") {
      return { error: "Bet is not active for cash out" };
    }

    const match = await Match.findById(bet.match);
    if (!match) return { error: "Match not found" };

    if (match.status === "finished") {
      return { error: "Match already finished, cannot cash out" };
    }

    const { stake, potentialPayout, choice } = bet;

    let offer = 0;

    // 1) Upcoming: just a partial refund
    if (match.status === "upcoming") {
      offer = stake * 0.9; // 90% refund, 10% fee
    } else if (match.status === "ongoing") {
      // 2) Ongoing: dynamic based on current score
      let currentResult = "X";
      if (match.score.home > match.score.away) currentResult = "1";
      else if (match.score.away > match.score.home) currentResult = "2";

      let baseValue = 0;

      if (choice === currentResult) {
        // currently winning
        baseValue = potentialPayout * 0.6;
      } else if (currentResult === "X" && choice === "X") {
        // drawing and bet is on draw
        baseValue = potentialPayout * 0.5;
      } else if (currentResult === "X") {
        // drawing but bet is not draw
        baseValue = potentialPayout * 0.35;
      } else {
        // currently losing
        baseValue = potentialPayout * 0.15;
      }

      // Apply house margin (book always wins a bit)
      offer = baseValue * 0.9;
    } else {
      // Fallback
      offer = stake * 0.9;
    }

    // 3) Clamp offer so it's never crazy
    const minOffer = stake * 0.1; // at least 10% of stake
    const maxOffer = potentialPayout * 0.8; // at most 80% of full win

    if (offer < minOffer) offer = minOffer;
    if (offer > maxOffer) offer = maxOffer;

    // Round to integer (XAF)
    offer = Math.round(offer);

    // Important: guarantee we never give more than stake for upcoming matches
    if (match.status === "upcoming" && offer > stake) {
      offer = stake; // or stake * 0.9 if you want a guaranteed fee
    }

    // 4) Apply cash out
    const user = await User.findById(userId);
    if (!user) return { error: "User not found" };

    user.wallet.balance += offer;
    await user.save();

    bet.status = "cashed_out";
    bet.settledAt = new Date();
    bet.xpEarned = 0; // still 0, or you can give tiny XP
    await bet.save();

    return {
      data: {
        cashOutAmount: offer,
        bet,
      },
    };
  }
}

const betService = new BetService();
module.exports = betService;
