const User = require('../model/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handleFactory')
const multer = require('multer');
const sharp = require('sharp');
// const multerDiskSrorage = multer.diskStorage({
//   destination:(req,file ,cb )=>{
//     cb(null, 'public/img/users')
//   },
//   filename:(req, file, cb)=>{
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
//   }
// })

const  multerDiskSrorage = multer.memoryStorage();
const multerFilter = (req, file, cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null,true )
  }else{
    cb(new AppError('Not an image ! Please upload the image',400),false );
  }
}
const upload = multer({
  storage:multerDiskSrorage,
  fileFilter:multerFilter,
})

exports.uloadUserPhoto = upload.single('photo')
const filteredOj = (obj, ...updateVal) => {
  const newfilteredObj = {};
  Object.keys(obj).forEach((val) => {
    if (updateVal.includes(val)) newfilteredObj[val] = obj[val];
  });
  return newfilteredObj;
};

exports.resizeUserPhoto = (req, res, next)=>{
  next();

  if(!req.file) return;

  req.file.filename =  `user-${req.user.id}-${Date.now()}`

  sharp(req.file.buffer)
  .resize(500, 500)
  .toFormat('jpeg')
  .jpeg({quality:90})
  .toFile(`public/img/users/${req.file.filename}.jpeg`)

}

//Update Current user
exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.file)
  console.log(req.body)
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not for password . To update your date use this route /update-me'
      )
    );
  }
  const filteredBody = filteredOj(req.user, 'name', 'email');
  if(req.file) filteredBody.photo = req.file.filename;
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











