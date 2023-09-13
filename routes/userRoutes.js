const express = require('express');
const rateLimit = require('express-rate-limit');

const authController = require('../controllers/authController');

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} = authController;

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  updateMe,
  deleteMe,
  deleteUser,
  getMe,
} = require('../controllers/userController');

const limiter = rateLimit({
  max: process.env.MAX_LOGIN_ATTEMPTS,
  windowMs: process.env.LOGIN_ATTEMPTS_TIMEOUT * 60 * 1000,
  message: 'Too many login attempts, please try again in an hour!',
});

const router = express.Router();

router.post('/signup', signup);
router.post('/login', limiter, login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(protect);
/*................*/

router.patch('/updateMyPassword', updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

router.use(restrictTo('admin'));
/*............................*/

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
