const express  = require('express')
const reviewController = require('../controllers/reviewController')
const authController = require('../controllers/authController')
const router = express.Router({mergeParams:true});

router.route('/')
    .get(reviewController.getAllReviews)
    .post(authController.protect, 
    authController.restrictTo('user'),
    reviewController.attachTourAndUserIDs,
    reviewController.createReview)

router.route('/:id')
    .delete(reviewController.deleteReview)
    .patch(reviewController.updateReview)
    .get(reviewController.getReview)
module.exports = router;