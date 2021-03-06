const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, Owner } = require('../../db/models');

const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const owner = require('../../db/models/owner');

router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );

  //Get the Current User
  router.get(
    '/',
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

  const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      // .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
    handleValidationErrors
  ];

  //log in a user
  router.post(
    '/',
    validateLogin,
    async (req, res, next) => {
      const { credential, password } = req.body;
  
      // const owner = await Owner.login({credential, password});
      const user = await User.login({ credential, password });
  
      if (!user) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = ['The provided credentials were invalid.'];
        return next(err);
      }
  
      const token = setTokenCookie(res, user);
     if (user){
       return res.json({
         id: user.id,
         username: user.username,
         email: user.email,
         // token: token
       }
         // user.toSafeObject()
       );
     }
    //  if (owner){
    //   return res.json({
    //     id: owner.id,
    //     username: owner.username,
    //     email: owner.email,
    //     // token: token
    //   })
    //  }
    }
  );

module.exports = router;