const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes')
const router = express.Router();

// router.param('id', tourController.checkID);

router.use('/:tourId/review', reviewRouter)
router.route('/tour-stats').get(tourController.tourStats);
router.route('/monthly-plans/:year').get(
  authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),tourController.getMonthlyPlans);
router
  .route('/top-5-cheaper-tours')
  .get(tourController.topFiveCheaperQuery, tourController.getAllTours);
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances)
router.route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.toursWithin);
router
  .route('/')
  .get( tourController.getAllTours)
  .post(authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourPhotos,
    tourController.resizeTourImages,
    tourController.updateTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
