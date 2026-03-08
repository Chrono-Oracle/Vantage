const User = require("../models/User");
const BaseService = require("./base.service");
const { comparePassword } = require("../../utils/lib/bcrypt.lib");
const { sign } = require("../../utils/lib/jwt.lib");

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
      if (!id) {
        return {
          error: true,
          message: "ID is required",
        };
      }

      const result = await this.model.findById(id);
      if (!result) {
        return {
          error: true,
          message: "User not found",
        };
      }

      return {
        error: false,
        data: result,
        message: "User found",
      };
    } catch (error) {
      return {
        error: true,
        message: error.message || "Failed to fetch user, try again later",
      };
    }
  }

  // follow a user
  async followUser(currentUserId, targetUserId) {
    try {
      if (currentUserId === targetUserId) {
        return {
          error: true,
          message: "Cannot follow yourself",
        };
      }

      const session = await this.model.startSession();

      const result = await session.withTransaction(async () => {
        // Current user follows target
        await this.model.findByIdAndUpdate(
          currentUserId,
          { $addToSet: { following: targetUserId } },
          { session, runValidators: true },
        );

        // Target gains follower
        await this.model.findByIdAndUpdate(
          targetUserId,
          { $addToSet: { followers: currentUserId } },
          { session, runValidators: true },
        );

        // Update counts
        await this.model.findByIdAndUpdate(
          currentUserId,
          { $inc: { followingCount: 1 } },
          { session },
        );

        await this.model.findByIdAndUpdate(
          targetUserId,
          { $inc: { followersCount: 1 } },
          { session },
        );
      });

      await session.endSession();

      return {
        error: false,
        message: "Followed successfully",
      };
    } catch (error) {
      return {
        error: true,
        message: error.message || "Failed to follow user",
      };
    }
  }

  // Unfollow a user
  async unfollowUser(currentUserId, targetUserId) {
    try {
      const session = await this.model.startSession();

      const result = await session.withTransaction(async () => {
        // Current user unfollows target
        await this.model.findByIdAndUpdate(
          currentUserId,
          { $pull: { following: targetUserId } },
          { session },
        );

        // Target loses follower
        await this.model.findByIdAndUpdate(
          targetUserId,
          { $pull: { followers: currentUserId } },
          { session },
        );

        // Update counts
        await this.model.findByIdAndUpdate(
          currentUserId,
          { $inc: { followingCount: -1 } },
          { session },
        );

        await this.model.findByIdAndUpdate(
          targetUserId,
          { $inc: { followersCount: -1 } },
          { session },
        );
      });

      await session.endSession();

      return {
        error: false,
        message: "Unfollowed successfully",
      };
    } catch (error) {
      return {
        error: true,
        message: error.message || "Failed to unfollow user",
      };
    }
  }
}

const userService = new UserService();
module.exports = userService;
