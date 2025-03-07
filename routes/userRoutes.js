const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forget-password', authController.forgetPassword);
router.patch('/reset-password/:token', authController.resetPassword);

router.use(authController.protect);
router.patch(
  '/change-my-password',
  authController.changePassword
);
router.get('/me', userController.getMe, userController.getUser)
router.patch('/update-me', 
  userController.uloadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe);
router.delete('/delete-me', userController.deleteMe);

router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)
  .delete(userController.deleteMe)
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
