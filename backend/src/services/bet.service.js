const Bet = require("../models/Bet");
const BaseService = require("./base.service");
const userService = require("./user.service");
const Match = require("../models/Match");

class BetService extends BaseService {
  constructor() {
    super(Bet);
  }

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

  async settleMatchBets(matchId, finalResult) {
    const bets = await this.model.find({ match: matchId, status: "pending" });

    for (let bet of bets) {
      const isWin = bet.choice === finalResult;

      // Calculate XP (using the multipliers we defined previously)
      const xpResult = await userService.updateXP(bet.user, 100, isWin);

      if (isWin) {
        // Handle Wallet Payout
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
}

const betService = new BetService();
module.exports = betService;
