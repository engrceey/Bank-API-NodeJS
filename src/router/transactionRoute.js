const express = require("express");
const { Authenticate, isAdmin } = require("../middleware/authMiddleware");
const {
  deposit, withdraw, getAllTransactions, getTransaction, transfer
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

router.get(
  '/',
  Authenticate,
  getTransaction
)

router.get(
  '/transactions',
  Authenticate,
  isAdmin,
  getAllTransactions
)

router.get(
  '/transfer',
  Authenticate,
  transfer
)


// Transfer
// Get transaction 

module.exports = router;
