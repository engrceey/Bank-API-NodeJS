const express = require("express");
const { Authenticate, isAdmin } = require("../middleware/authMiddleware");
const {
  deposit, withdraw, getAllTransactions, getTransaction, transfer, convertCurrency
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

router.post(
  '/transfer',
  Authenticate,
  transfer
)

router.get(
  '/convertcurrency',
  Authenticate,
  convertCurrency
)


// Transfer
// Get transaction 

module.exports = router;
