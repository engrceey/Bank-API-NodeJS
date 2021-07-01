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

router.post("/create", Authenticate, createAccount);

router.post("/changePin", Authenticate, changePin);

router.delete("/admin/delete", Authenticate, isAdmin, deleteAccount);

router.delete("/delete", Authenticate, deleteYourAccount);

router.get("/", Authenticate, getAccount);

router.get("/accounts", Authenticate, isAdmin, getAccounts);

module.exports = router;
