const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter).select('-__v');
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews },
  });
});

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createOne(Review, 'review');
exports.updateReview = factory.updateOne(Review, 'review');
exports.deleteReview = factory.deleteOne(Review, 'review');
