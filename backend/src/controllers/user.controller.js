const userService = require("../services/user.service");
const { hashPassword, comparePassword } = require("../../utils/lib/bcrypt.lib");
const User = require("../models/User");
const { sign } = require("../../utils/lib/jwt.lib");

const register = async (req, res) => {
  try {
    const data = req.body;
    const email = data.email.toLowerCase();
    const find = await User.findOne({ email });
    if (find) {
      return res.status(404).json({
        message: "Email already exists !!!",
      });
    }

    const password = await hashPassword(data.password);

    // await User.create({ ...data, password });

    const newUser = await userService.create({ ...data, password });
    console.log("New User Created: ", newUser);

    return res.status(201).json({
      message: "User registered successfully!!!",
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({
      message: "Internal Server Error, please retry later !!!",
    });
  }
};

const findMany = async (req, res) => {
  const result = await userService.find({});
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(200).json({
    message: "Users fetched successfully!!!",
    data: result.data,
  });
};

const find = async (req, res) => {
  const result = await userService.findById(req.params.id);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(200).json({
    message: "User fetched successfully!!!",
    data: result.data,
  });
};

const update = async (req, res) => {
  const result = await userService.update(req.params.id, req.body);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(201).json({
    message: "User updated successfully!!!",
  });
};

const remove = async (req, res) => {
  const result = await userService.remove(req.params.id);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(201).json({
    message: "User deleted successfully!!!",
  });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "_id password role",
    );

    const result = await userService.login({ email, password });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const verify = await comparePassword(password, user.password);
    if (!verify) {
      return res.status(400).json({
        message: "Incorrect Password",
      });
    }

    if (verify) {
      const token = sign({ id: user._id, role: user.role, email: user.email });

      // NEW: set httpOnly cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      console.log("role: user.role", user.role);

      return res.json({
        message: "User login successfully !!!",
        data: { token, id: user._id, role: user.role },
      });
    }

    return res.status(400).json({
      message: "Invalid credentials !!!",
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({
      message: "Internal Server Error, please retry later !!!",
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

const profile = async (req, res) => {
  const result = await userService.findById(req.user.id);
  if (result.error) {
    return res.status(400).json({
      message: result.error,
    });
  }

  return res.status(200).json({
    message: "User profile fetched successfully!!!",
    data: result.data,
  });
};

const follow = async (req, res) => {
  const currentUserId = req.user.id;
  const targetUserId = req.params.userId;

  const result = await userService.followUser(currentUserId, targetUserId);

  if (result.error) {
    return res.status(400).json({ message: result.message });
  }

  return res.status(200).json({ message: result.message });
};

const unfollow = async (req, res) => {
  const currentUserId = req.user.id;
  const targetUserId = req.params.userId;

  const result = await userService.unfollowUser(currentUserId, targetUserId);

  if (result.error) {
    return res.status(400).json({ message: result.message });
  }

  return res.status(200).json({ message: result.message });
};

const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { action, type, id } = req.body;

    if (!["sport", "club"].includes(type)) {
      return res
        .status(400)
        .json({ message: "Invalid type. Use 'sport' or 'club'" });
    }

    let result;
    if (action === "follow") {
      result = await userService.followFavorite(userId, {
        sportId: type === "sport" ? id : null,
        clubId: type === "club" ? id : null,
      });
    } else if (action === "unfollow") {
      result = await userService.unfollowFavorite(userId, {
        sportId: type === "sport" ? id : null,
        clubId: type === "club" ? id : null,
      });
    }

    // Now correctly handles the "Already followed" or "Not following" errors
    if (result.error) {
      return res.status(400).json({ message: result.message });
    }

    return res.status(200).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  register,
  findMany,
  find,
  update,
  remove,
  login,
  logout,
  profile,
  follow,
  unfollow,
  toggleFavorite,
};
