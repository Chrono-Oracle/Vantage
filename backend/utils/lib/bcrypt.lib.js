const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  if (password.length === 0)
    throw new Error("Password is required for hashing");
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
