const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Review, Spot, Reservation } = require('../../db/models');

const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign Up a User
router.post(
  '/',
  validateSignup,
  async (req, res, next) => {
    const { email, password, username } = req.body;
    const user = await User.signup({ email, username, password });


    const token = setTokenCookie(res, user);
    // const { token2 } = restoreUser();
    // const { token } = req.csrfToken();
    // console.log(token)
    // setTokenCookie(res,user)
    // const {token} = setTokenCookie()
    console.log(res.cookie)
    return res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      token: token
    });
  }
);

// Get all Spots owned by the Current User
router.get('/currentUser/spots', restoreUser, async (req, res) => {
  const { user } = req;
  const spotUserId = await Reservation.findAll({
    where: { userId: user.id },
    attributes: ['spotId'],
    include: [{ model: Spot, attributes:{exclude: ['image',"createdAt", "updatedAt"]}}]
    // include: [{ model: Spot}]
  })
  const spots = spotUserId.map(place => place.Spot)
  res.json({ Spots: spots })
})

//Get all Reviews of the Current User
router.get('/currentUser/reviews', restoreUser, async (req, res) => {
  const { user } = req;

  const reviews = await Review.findAll({
    where: { userId: user.id },
    include: [{ model: User }, { model: Spot }],
  })
  res.json(reviews)
})


module.exports = router;