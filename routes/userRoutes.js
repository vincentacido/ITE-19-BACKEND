const express = require("express");
const userController = require("../controller/userController");

const router = express.Router();

router.post("/login", userController.userLogin);
router.post("/register", userController.createUser);
module.exports = router;
