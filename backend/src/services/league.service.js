const BaseService = require("./base.service");
const League = require("../models/League");

class LeagueService extends BaseService {
  constructor() {
    super(League);
  }
}

const leagueService = new LeagueService();
module.exports = leagueService;
