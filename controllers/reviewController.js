
const catchAsync = require('../utils/catchAsync');
const Review = require('../model/reviewModel')
const factory = require('../controllers/handleFactory')
// const AppError = require('../utils/appError');

exports.attachTourAndUserIDs =(req, res, next)=>{
   if(!req.body.tour) req.body.tour = req.params.tourId
   if(!req.body.user) req.body.user = req.user.id
   next();
}
exports.getReview= factory.getOne(Review);
exports.getAllReviews=factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
