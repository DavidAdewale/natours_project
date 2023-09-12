const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      maxLength: [40, 'A tour name must have less or equal than 40 characters'],
      minLength: [10, 'A tour name must more less or equal to 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: { type: Number, required: [true, 'A tour must have a duration'] },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficult is either easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below or equal to 5.0'],
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'A tour must have a price'] },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          /*this only points to the current doc on the NEW document creation*/
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: { type: String, trim: true },
    imageCover: {
      type: 'String',
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: { type: Date, default: Date.now(), select: false },
    startDates: [Date],
    secretTour: { type: Boolean, default: false },
    startLocation: {
      type: { type: String, default: 'Point', enum: ['Point'] },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: { type: String, default: 'Point', enum: ['Point'] },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

toursSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

toursSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create() but !== .insertMany() or update()
toursSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/*
toursSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
});
*/

/*
toursSchema.pre('save', function (next) {
  console.log('Will save document...');
  next();
});

//Post middleware
toursSchema.post('save', (doc, next) => {
  console.log(doc);
  next();
});
*/

//QUERY MIDDLEWARE
toursSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

toursSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt -passwordResetToken',
  });
  next();
});

//AGGREGATION MIDDLEWARE
toursSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});
toursSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} ms`);
  next();
});

const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;
