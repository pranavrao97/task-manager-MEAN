const express = require("express");
const router = express.Router();
const { User } = require("../db/models/index");
const { verifySession } = require("../authenticate");
const {
  signUpUser,
  login,
  refreshAccessToken,
} = require("../controllers/users.controller");

/**
 * POST Users
 */
router.post("/", signUpUser);

router.post("/login", login);

router.get("/me/accessToken", verifySession, refreshAccessToken);

module.exports = router;
