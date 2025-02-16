const User = require('../model/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handleFactory')

const filteredOj = (obj, ...updateVal) => {
  const newfilteredObj = {};
  Object.keys(obj).forEach((val) => {
    if (updateVal.includes(val)) newfilteredObj[val] = obj[val];
  });
  return newfilteredObj;
};

//Update Current user
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not for password . To update your date use this route /update-me'
      )
    );
  }
  const filteredBody = filteredOj(req.user, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
exports.getMe=(req, res, next)=>{
  req.params.id = req.user.id;
  next();
}
//Delete current user
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet use the /signup',
  });
};
exports.getUser = factory.getOne(User);
exports.getAllUsers =factory.getAll(User);
//Without changing the password
exports.updateUser = factory.updateOne(User);
//Delete any user
exports.deleteUser = factory.deleteOne(User);











