const express = require("express");
const { Authenticate, isAdmin } = require("../middleware/authMiddleware");
const {
  validateSignUpDetails,
  validateLoginDetails,
  validateUpdateDetails
} = require("../middleware/userValidationMiddleware");
const {
  registerUser,
  signInUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controller/userController");

const router = express.Router();

router.post(
  "/register",
  validateSignUpDetails,
  registerUser
);

router.post(
  "/signin",
  validateLoginDetails,
  signInUser
);

router.get("/users", Authenticate, isAdmin, getUsers);

router.get("/email", Authenticate, getUser);

router.patch("/",validateUpdateDetails, Authenticate, updateUser);

router.delete("/email", Authenticate, isAdmin, deleteUser);

module.exports = router;
