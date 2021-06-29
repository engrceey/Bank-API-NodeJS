const express = require('express');
const { Authenticate } = require('../middleware/authMiddleware');
const { validateSignUpDetails, validateLoginDetails } = require('../middleware/validationMiddleware');
const { registerUser, signInUser } = require('../controller/userController');

const router = express.Router();

router.post(
    '/register',
    // validateSignUpDetails,
    registerUser
);

router.post(
    '/signin',
    // validateLoginDetails,
    signInUser
)

// get users Admin only
// update user
// get user
// delete user

module.exports = router;