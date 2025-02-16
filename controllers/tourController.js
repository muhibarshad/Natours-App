
const Tour = require('../model/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handleFactory')
// const AppError = require('../utils/appError');
exports.topFiveCheaperQuery = (req, res, next) => {
  req.query.sort = 'price,-ratingsAverage';
  req.query.limit = 5;
  req.query.fields = 'name,price,duration,difficulty,ratingsAverage,summary';
  next();
};

exports.getTour = factory.getOne(Tour);
exports.getAllTours = factory.getAll(Tour);
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.tourStats = catchAsync(async (req, res, next) => {
  const result = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgPrice: { $avg: '$price' },
        avgRating: { $avg: '$ratingsAverage' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    {
      $match: { _id: { $ne: 'easy' } },
    },
  ]);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: result,
  });
});
exports.getMonthlyPlans = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $sort: { numTours: -1 },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: { _id: 0 },
    },
    {
      $limit: 6,
    },
  ]);
  res.status(200).json({
    status: 'success',
    results: plan.length,
    requestedAt: req.requestTime,
    data: plan,
  });
});
