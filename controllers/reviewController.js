const Review = require('../models/reviewModel');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review, 'review');
exports.getReview = factory.getOne(Review, 'review');
exports.createReview = factory.createOne(Review, 'review');
exports.updateReview = factory.updateOne(Review, 'review');
exports.deleteReview = factory.deleteOne(Review, 'review');
