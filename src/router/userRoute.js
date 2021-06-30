const express = require('express');
const { Authenticate, isAdmin } = require('../middleware/authMiddleware');
const { validateSignUpDetails, validateLoginDetails } = require('../middleware/validationMiddleware');
const { registerUser, signInUser, getUser, getUsers } = require('../controller/userController');

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


router.get(
    '/users',
    Authenticate,
    isAdmin,
    getUsers
)

router.get(
    '/email',
    Authenticate,
    getUser
)


router.patch(
    '/update/id',
    Authenticate
)

router.delete(
    '/id',
    Authenticate,
    isAdmin
)


// get users Admin only
// update user
// get user 
// delete user Admin only

module.exports = router;