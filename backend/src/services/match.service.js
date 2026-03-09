const Match = require("../models/Match");
const MatchFollow = require("../models/MatchFollow");
const BaseService = require("./base.service");

class MatchService extends BaseService {
  constructor() {
    super(Match);
  }

  async followMatch(userId, matchId) {
    try {
      // check if already following
      const exists = await MatchFollow.findOne({
        user: userId,
        match: matchId,
      });
      if (exists)
        return { error: true, message: "Already following this match" };

      await MatchFollow.create({ user: userId, match: matchId });

      // TRIGGER XP REWARD: +50 XP for following a match
      const userService = require("./user.service");
      await userService.updateXP(userId, 50);

      return { error: false, message: "Match followed! +50 XP" };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  // Logic to unfollow
  async unfollowMatch(userId, matchId) {
    try {
      // Use findOneAndDelete to get the document that was removed
      const result = await MatchFollow.findOneAndDelete({
        user: userId,
        match: matchId,
      });

      // If result is null, it means no record existed to be deleted
      if (!result) {
        return {
          error: true,
          message: "You are not following this match",
        };
      }

      return { error: false, message: "Match unfollowed successfully" };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  // Logic to see WHO else is following this match
  async getMatchFollowers(matchId) {
    try {
      const followers = await MatchFollow.find({ match: matchId })
        .populate("user", "fullName avatar level rankTitle") // Only fetch public info
        .limit(20); // Limit to top 20 for performance

      return { error: false, data: followers.map((f) => f.user) };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }
}

const matchService = new MatchService();
module.exports = matchService;
