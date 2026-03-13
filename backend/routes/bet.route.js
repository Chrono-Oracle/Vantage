const { Router } = require("express");
const router = Router();

const betController = require("../src/controllers/bet.controller");
const { authMiddleware } = require("../utils/middlewares/auth.middleware");

// Existing routes
router.post("/create", betController.create);
router.get("/", betController.findMany);
router.get("/find/:id", betController.find);
router.put("/update/:id", betController.update);
router.delete("/delete/:id", betController.remove);

router.get("/my", authMiddleware, betController.findUserBets);

// NEW: place multiple bets from bet slip (must be logged in)
router.post("/place-from-slip", authMiddleware, betController.placeFromSlip);

// NEW: cash out
router.post("/:id/cash-out", authMiddleware, betController.cashOut);

module.exports = router;
