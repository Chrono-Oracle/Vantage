//team route
const { Router } = require("express");
const router = Router();

const { teamValidation } = require("../utils/validations/team.validation");
const teamController = require("../src/controllers/team.controller");

router.post("/create", teamValidation, teamController.create);
router.get("/", teamController.findMany);
router.get("/find/:id", teamController.find);
router.put("/update/:id", teamValidation, teamController.update);
router.delete("/delete/:id", teamController.remove);

module.exports = router;
