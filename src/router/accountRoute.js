const express = require("express");
const { Authenticate, isAdmin } = require("../middleware/authMiddleware");
const { createAccount, changePin } = require("../controller/accountController");

const router = express.Router();

// Get account details
// Delete account

router.post(
    "/create",
    Authenticate,
    createAccount
  );

  router.post(
    '/changePin',
    Authenticate,
    changePin
  )

  module.exports = router;