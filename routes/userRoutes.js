const express = require('express');
const authController = require('../controllers/authController');

const { signup, login } = authController;

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser);

module.exports = router;
