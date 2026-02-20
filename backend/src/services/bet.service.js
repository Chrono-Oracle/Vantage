const Bet = require("../models/Bet");
const BaseService = require('./base.service');


class BetService extends BaseService {
  constructor () {
    super(Bet);
  }
}


const betService = new BetService();
module.exports = betService;



// const create = async (data) => {
//   try {
//     const result = await Bet.create(data);
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

//     const result = await Bet.findOne(where);
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
//     const result = await Bet.findByIdAndUpdate(id, data);
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
//     const result = await Bet.findByIdAndDelete(id);
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
