const User = require("../models/User");
const BaseService = require('./base.service');
const { comparePassword } = require('../../utils/lib/bcrypt.lib');
const { generateToken } = require('../../utils/lib/jwt.lib');


class UserService extends BaseService {
  constructor () {
    super(User);
  }

  async login(data) {
    try {
      if (!data.email || !data.password) {
        return {
          error: true,
          message: "Email and password are required",
        };
      }

      const user = await this.model.findOne({ email: data.email });
      if (!user) {
        return {
          error: true,
          message: "User not found",
        };
      }

      const isPasswordValid = await comparePassword(data.password, user.password);
      if (!isPasswordValid) {
        return {
          error: true,
          message: "Invalid password",
        };
      }

      const token = generateToken({ id: user._id, email: user.email });
      return {
        error: false,
        data: {
          user,
          token,
        },
        message: "Login successful",
      };
    } catch (error) {
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
}


const userService = new UserService();
module.exports = userService;



// const create = async (data) => {
//   try {
//     const result = await User.create(data);
//     return { error: false, data: result };
//   } catch (error) {
//     return {
//       error: true,
//       message:
//         error.message || "Internal Server Error, Please try again later.",
//     };
//   }
// };

// const findBy = async (filter) => {
//   try {
//     const where = typeof filter === "string" ? { _id: filter } : filter;

//     const result = await User.findOne(where);
//     return { error: false, data: result };
//   } catch (error) {
//     return {
//       error: true,
//       message:
//         error.message || "Internal Server Error, Please try again later.",
//     };
//   }
// };

// const update = async (id, data) => {
//   try {
//     const result = await User.findByIdAndUpdate(id, data);
//     return { error: false, data: result };
//   } catch (error) {
//     return {
//       error: true,
//       message:
//         error.message || "Internal Server Error, Please try again later.",
//     };
//   }
// };

// const remove = async (id) => {
//   try {
//     const result = await User.findByIdAndDelete(id);
//     return { error: false, data: result };
//   } catch (error) {
//     return {
//       error: true,
//       message:
//         error.message || "Internal Server Error, Please try again later.",
//     };
//   }
// };

// module.exports = {
//   create,
//   findBy,
//   update,
//   remove,
// };
