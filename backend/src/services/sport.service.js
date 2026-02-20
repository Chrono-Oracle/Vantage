const BaseService = require('./base.service');
const Sport = require("../models/Sport");


class SportService extends BaseService {
  constructor () {
    super(Sport);
  }
}


const sportService = new SportService();
module.exports = sportService;

// const create = async (data) => {

//   try {
//     const result = await Sport.create(data);
//     return { error: false, data: result };
//   } catch (error) {

//     return {
//         error: true,
//         message: error.message || 'Internal Error, Please try again !!!'
//     };
//   }
// };

// const findBy = async (filter) => {

//   try {
//     const where = typeof filter === "string" ? { _id: filter } : filter;

//     const result = await Sport.find(where);
//     return { error: false, data: result };
//   } catch (error) {

//     return {
//         error: true,
//         message: error.message || 'Internal Error, Please try again !!!'
//     };
//   }
// };


// const update = async (id, data) => {

//   try {
//     const result = await Sport.findByIdAndUpdate(id, data);
//     return { error: false, data: result };
//   } catch (error) {

//     return {
//         error: true,
//         message: error.message || 'Internal Error, Please try again !!!'
//     };
//   }
// };

// const remove = async (id) => {

//   try {
//     const result = await Sport.findByIdAndDelete(id);
//     return { error: false, data: result };
//   } catch (error) {

//     return {
//         error: true,
//         message: error.message || 'Internal Error, Please try again !!!'
//     };
//   }
// };

// module.exports = { create, findBy, update, remove };
