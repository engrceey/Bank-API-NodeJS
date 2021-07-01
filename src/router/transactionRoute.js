const express = require("express");
const { Authenticate, isAdmin } = require("../middleware/authMiddleware");
const {
  createAccount,
  changePin,
  deleteAccount,
  getAccount,
  getAccounts,
  deleteYourAccount,
} = require("../controller/accountController");

const router = express.Router();