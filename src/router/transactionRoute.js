const express = require("express");
const { Authenticate, isAdmin } = require("../middleware/authMiddleware");
const {
  deposit, withdraw
} = require("../controller/transactionController");

const router = express.Router();

router.post(
  '/deposit',
  Authenticate,
  isAdmin,
  deposit
)

router.get(
  '/withdraw',
  Authenticate,
  withdraw
)


// Deposit
// Transfer
// Get transaction 

module.exports = router;
