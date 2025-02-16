
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeaturs = require('../utils/apifeatures');

exports.deleteOne = Model=>catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with this id ', 404));
    }
    res.status(204).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: null,
    });
  });

exports.updateOne = Model =>catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No document found with this id ', 404));
    }
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        data:doc,
      },
    });
  });
exports.createOne = Model=>catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    if (!doc) {
      return next(new AppError('No document found with this id ', 404));
    }
    res.status(201).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        data: doc,
      },
    });
  });
exports.getOne = (Model, popOptiions) =>catchAsync(async (req, res, next) => {
    let query =Model.findById(req.params.id);
    if(popOptiions) query= query.populate(popOptiions)
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with this id ', 404));
    }
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        data: doc,
      },
    });
  });
exports.getAll= Model=>catchAsync(async (req, res) => {
    //For only the getting reviews for the specific tour (jugar)
    let filter = {};
    if(req.params.tourId) filter  = {tour : req.params.tourId}
    
    const features = new APIFeaturs(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitingFields()
      .pagination();
    const docs = await features.query;
    res.status(200).json({
      status: 'success',
      results: docs.length,
      requestedAt: req.requestTime,
      data: {
        data: docs,
      },
    });
  });