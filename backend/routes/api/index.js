const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotRouter = require('./spots.js');
const reviewRouter = require('./review.js');
const reservationRouter = require('./reservation.js')
const imageRouter = require('./image.js')
const { restoreUser,setTokenCookie } = require("../../utils/auth.js");

router.post('/test', function (req, res) {
  res.json({ requestBody: req.body });
});

const { User } = require('../../db/models');

router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user });
});

const { requireAuth } = require('../../utils/auth.js');

router.use(restoreUser);
// router.use(requireAuth);

router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
);


router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotRouter);

router.use('/reviews', reviewRouter);

router.use('/bookings', reservationRouter);

router.use('/images', imageRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});



module.exports = router;