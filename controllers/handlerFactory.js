const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (Model, resourceName) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
      return next(
        new AppError(`No ${resourceName} was found with that ID`, 404),
      );
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model, resourceName) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(
        new AppError(`No ${resourceName} was found with that ID`),
        404,
      );
    }
    res.status(201).json({
      status: 'success',
      data: { [resourceName]: doc },
    });
  });

exports.createOne = (Model, resourceName) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { [resourceName]: doc },
    });
  });

exports.getOne = (Model, resourceName, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError(`No ${resourceName} found with that ID`, 404));
    }

    // Tour.findOne({ _id: id }) -would work the exact same way but the findById is a helper function that abstracts this from us
    res.status(200).json({
      status: 'success',
      data: { [resourceName]: doc },
    });
  });

exports.getAll = (Model, resourceName) =>
  catchAsync(async (req, res, next) => {
    /* To allow for nested GET reviews on tour (hack) */
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // const doc = await features.query.explain();
    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: { [resourceName]: doc },
    });
  });
