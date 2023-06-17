const mongoose = require('mongoose');
const Slugify = require('slugify');
// const validator = require('validator');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour name must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal to 40 characters'],
      minlength: [
        10,
        'A tour name must have greater or equal to 10 characters',
      ],
      // validate: [validator.isAlpha, 'A tour name only conatin characters'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have maxGroupSize'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have  a difficulty level'],
      enum: {
        values: ['difficult', 'easy', 'medium'],
        message: 'A tour difficulty must be difficult,easy and medium',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.7,
      max: [5, 'A tour ratings must be less or equal than 5'],
      min: [1, 'A tour ratings must be greater or equal than 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour name must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message:
          'A tour price discount ({VALUE}) must be below than original price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour name must have a Summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour name must have a imageCover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      Select: false,
    },
    startDates: [Date],
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
tourSchema.pre('save', function (next) {
  this.slug = Slugify(this.name, { lower: true });
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.startTime = Date.now();
  next();
});
tourSchema.post(/^find/, function () {
  console.log(`Query took ${Date.now() - this.startTime} ms`);
});
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
