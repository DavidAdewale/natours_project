const Review = require('../models/reviewModel');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  //get tour data
  const tours = await Tour.find();
  //build template
  //render the template using tour data
  res.status(200).render('overview', { title: 'All Tours', tours });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug });
  const tourId = tour.id;
  const reviews = await Review.find({ tour: tourId });
  console.log(reviews);
  res.status(200).render('tour', { title: tour.name, tour, reviews });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  console.log(req.body);
  res.status(200).render('login', { title: 'Log into your account' });
});
