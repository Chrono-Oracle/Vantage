const Match = require("../models/Match");
const BaseService = require('./base.service');


class MatchService extends BaseService {
  constructor () {
    super(Match);
  }
}


const matchService = new MatchService();
module.exports = matchService;


// const create = async (data) => {
//   try {
//     const result = await Match.create(data);
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

//     const result = await Match.findOne(where);
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
//     const result = await Match.findByIdAndUpdate(id, data);
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
//     const result = await Match.findByIdAndDelete(id);
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
