const express = require('express');
const viewsController = require('../controllers/viewsController');

const { getOverview, getTour, getLoginForm } = viewsController;

const router = express.Router();

router.get('/', getOverview);
router.get('/tour/:slug', getTour);

//login
router.get('/login', getLoginForm);

module.exports = router;
