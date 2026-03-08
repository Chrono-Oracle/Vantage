const { Router } = require("express");
const router = Router();

const { leagueValidation } = require("../utils/validations/league.validation");
const leagueController = require("../src/controllers/league.controller");

router.post("/create", leagueValidation, leagueController.create);
router.get("/", leagueController.findMany);
router.get("/:id", leagueController.find);
router.put("/update/:id", leagueValidation, leagueController.update);
router.delete("/delete/:id", leagueController.remove);

module.exports = router;
