const User = require("../models/User");
const BaseService = require("./base.service");
const Follow = require("../models/Follow");
const { comparePassword } = require("../../utils/lib/bcrypt.lib");
const { sign } = require("../../utils/lib/jwt.lib");

// RANK SKELETON
const RANKS = [
  { minLevel: 1, maxLevel: 10, title: "Rookie", gateXP: 0, multiplier: 1.0 },
  {
    minLevel: 11,
    maxLevel: 25,
    title: "Prospect",
    gateXP: 5000,
    multiplier: 1.2,
  },
  {
    minLevel: 26,
    maxLevel: 45,
    title: "Analyst",
    gateXP: 25000,
    multiplier: 1.5,
  }, // Loss starts here
  {
    minLevel: 46,
    maxLevel: 65,
    title: "Veteran",
    gateXP: 60000,
    multiplier: 2.0,
  },
  {
    minLevel: 66,
    maxLevel: 85,
    title: "Elite",
    gateXP: 110000,
    multiplier: 3.0,
  }, // The "Mythic" feel
  {
    minLevel: 86,
    maxLevel: 95,
    title: "Grandmaster",
    gateXP: 180000,
    multiplier: 4.5,
  },
  {
    minLevel: 96,
    maxLevel: 99,
    title: "Legend",
    gateXP: 250000,
    multiplier: 6.0,
  },
  {
    minLevel: 100,
    maxLevel: 100,
    title: "Mythic Hero",
    gateXP: 350000,
    multiplier: 10.0,
  },
];

class UserService extends BaseService {
  constructor() {
    super(User);
  }

  async login(data) {
    try {
      console.log("Data: ", data);
      if (!data.email || !data.password) {
        return {
          error: true,
          message: "Email and password are required",
        };
      }

      const user = await this.model.findOne({ email: data.email });
      console.log("User: ", user);

      if (!user) {
        return {
          error: true,
          message: "User not found",
        };
      }

      // const isPasswordValid = await comparePassword(data.password, user.password);
      const isPasswordValid = data.password === user.password;

      if (!isPasswordValid) {
        return {
          error: true,
          message: "Invalid password",
        };
      }

      const token = sign({ id: user._id, email: user.email });
      return {
        error: false,
        data: {
          user,
          token,
        },
        message: "Login successful",
      };
    } catch (error) {
      console.log("error: ", error);

      return {
        error: true,
        message: error.message || "Login failed, try again later",
      };
    }
  }

  async findById(id) {
    try {
      const user = await this.model.findById(id).select("-password"); // Hide password
      if (!user) return { error: true, message: "User not found" };

      // Calculate counts on the fly
      const followersCount = await Follow.countDocuments({ following: id });
      const followingCount = await Follow.countDocuments({ follower: id });

      // Merge the counts into the user data
      const userData = {
        ...user._doc,
        followersCount,
        followingCount,
      };

      return { error: false, data: userData };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  // Follow a user
  async followUser(followerId, followingId) {
    try {
      // 1. Check if user is trying to follow themselves
      if (followerId === followingId) {
        return { error: true, message: "You cannot follow yourself" };
      }

      // 2. Verify target user exists
      const targetUser = await this.model.findById(followingId);
      if (!targetUser) {
        return { error: true, message: "User to follow not found" };
      }

      // 3. Verify state: Check if already following
      const existingFollow = await Follow.findOne({
        follower: followerId,
        following: followingId,
      });

      if (existingFollow) {
        return { error: true, message: "You are already following this user" };
      }

      // 4. Create follow record
      await Follow.create({
        follower: followerId,
        following: followingId,
      });

      return { error: false, message: "Followed successfully" };
    } catch (error) {
      return { error: true, message: error.message || "Failed to follow user" };
    }
  }

  // Unfollow a user
  async unfollowUser(followerId, followingId) {
    try {
      // 1. Verify state: Check if follow relationship exists
      const followRecord = await Follow.findOneAndDelete({
        follower: followerId,
        following: followingId,
      });

      if (!followRecord) {
        return { error: true, message: "You are not following this user" };
      }

      return { error: false, message: "Unfollowed successfully" };
    } catch (error) {
      return {
        error: true,
        message: error.message || "Failed to unfollow user",
      };
    }
  }

  // Calculate counts dynamically
  async getFollowStats(userId) {
    try {
      const followersCount = await Follow.countDocuments({ following: userId });
      const followingCount = await Follow.countDocuments({ follower: userId });

      return {
        error: false,
        data: { followersCount, followingCount },
      };
    } catch (error) {
      return { error: true, message: "Could not fetch follow stats" };
    }
  }

  // RANKS LOGIC
  async updateXP(userId, baseAmount, isWin = true) {
    try {
      const user = await this.model.findById(userId);
      if (!user) return { error: true, message: "User not found" };

      // 1. Get current rank config
      const currentRank = RANKS.find(
        (r) => user.level >= r.minLevel && user.level <= r.maxLevel,
      );

      // 2. Calculate actual XP change using the multiplier
      // Gains are slightly higher than losses as per your request
      let xpChange = isWin
        ? Math.floor(baseAmount * currentRank.multiplier)
        : -Math.floor(baseAmount * (currentRank.multiplier * 0.8));

      // 3. Early Game Protection (Level 1-25)
      if (user.level <= 25 && !isWin) {
        xpChange = 0; // No XP loss for Rookies and Prospects
      }

      let newXP = user.experiencePoints + xpChange;

      // 4. Rank Floor Protection (Gate Logic)
      if (!isWin && user.level >= 26) {
        if (user.level <= 85) {
          // Standard Rank Floor (Analyst, Veteran, Elite)
          if (newXP < currentRank.gateXP) newXP = currentRank.gateXP;
        } else {
          // Brutal Zone (Level 86-100): Fall back to the start of Grandmaster
          const gmGate = RANKS.find((r) => r.title === "Grandmaster").gateXP;
          if (newXP < gmGate) newXP = gmGate;
        }
      }

      // 5. Calculate New Level (Using a dynamic curve)
      // For simplicity: newXP / (average XP per level)
      let newLevel = this.calculateLevelFromXP(newXP);
      if (newLevel > 100) newLevel = 100;

      // 6. Update Title
      const newRank = RANKS.find(
        (r) => newLevel >= r.minLevel && newLevel <= r.maxLevel,
      );

      // Update level based on XP thresholds
      user.experiencePoints = newXP;
      user.level = newLevel;
      user.rankTitle = newRank ? newRank.title : "Legend";

      // Only update title if they haven't reached 100 (where they choose their own)
      if (user.level < 100) {
        user.rankTitle = newRank.title;
      }

      await user.save();
      return {
        error: false,
        data: {
          xpGained: xpChange,
          currentXP: user.experiencePoints,
          level: user.level,
          rank: user.rankTitle,
        },
      };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  // Add this helper method to ensure levels match your RANK array perfectly
  calculateLevelFromXP(xp) {
    // Basic logic: every 3500 XP is a level, but capped at 100
    let level = Math.floor(xp / 3500) + 1;
    return Math.min(level, 100);
  }
}

const userService = new UserService();
module.exports = userService;
