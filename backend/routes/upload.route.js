const { Router } = require("express");
const router = Router();

const { upload } = require("../utils/helpers/upload.helper");
const { uploadImage } = require("../src/controllers/upload.controller");

router.post("/image", upload.single("file"), uploadImage);

module.exports = router;
