const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Review, Spot, Booking } = require('../../db/models');

const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    // .isLength({ min: 4 })
    // .withMessage('Please provide a username with at least 4 characters.'),
    .withMessage('User Name is required'),
  // check('username')
  //   .not()
  //   .isEmail()
  //   .withMessage('Username is required.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First Name is required'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last Name is required'),
  handleValidationErrors
];

 //Get the Current User
 router.get(
  '/current',
  restoreUser,
  (req, res) => {
    const { user } = req;
    if (user) {
      return res.json(
        user.toSafeObject()
         );
    } else return res.json("No logg in user");
  }
);

// Sign Up a User
router.post(
  '/',
  validateSignup,
  async (req, res, next) => {
    const { firstName, lastName, email, username, password } = req.body;
    const user = await User.signup({ firstName, lastName, email, username, password });


    const token = setTokenCookie(res, user);
    // const { token2 } = restoreUser();
    // const { token } = req.csrfToken();
    // console.log(token)
    // setTokenCookie(res,user)
    // const {token} = setTokenCookie()
    return res.json({
      firstName,
      lastName,
      email,
      username,
      token: token
    });
  }
);





module.exports = router;