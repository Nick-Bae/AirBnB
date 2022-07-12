const express = require('express');

const { setTokenCookie, requireAuth,restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();
const {check}=require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');
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
        email:user.email,
        token: token
      });
    }
  );


module.exports = router;