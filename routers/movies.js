const express = require("express");
const router = express.Router();
const moviesController = require("../controllers/moviesController.js");

router.get("/", moviesController.index);
// router.get("/", moviesController.show);

module.exports = router;
