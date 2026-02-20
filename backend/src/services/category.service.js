const Category = require("../models/Category");
const BaseService = require('./base.service');


class CategoryService extends BaseService {
  constructor () {
    super(Category);
  }
}


const categoryService = new CategoryService();
module.exports = categoryService;

// const create = async (data) => {
//   try {
//     const result = await Category.create(data);
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

//     const result = await Category.findOne(where);
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
//     const result = await Category.findByIdAndUpdate(id, data);
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
//     const result = await Category.findByIdAndDelete(id);
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
