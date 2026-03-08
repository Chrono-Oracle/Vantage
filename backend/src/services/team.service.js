const BaseService = require("./base.service");
const Team = require("../models/Team");

class TeamService extends BaseService {
  constructor() {
    super(Team);
  }
}

const teamService = new TeamService();
module.exports = teamService;
