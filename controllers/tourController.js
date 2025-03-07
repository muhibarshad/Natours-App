
const Tour = require('../model/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handleFactory')
const AppError = require('../utils/appError');
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

exports.uploadTourPhotos = upload.fields([
  {name: 'imageCover', maxCount: 1}, 
  {name :'images', maxCount:3}
])

// upload.single('image')
// upload.array('images', 5)

exports.resizeTourImages= (req, res, next)=>{
  console.log(req.files)
  next();
}
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

//http://127.0.0.1:3000/api/v1/tours/tours-within/400/center/34.1117,-118.113491/unit/mi
exports.toursWithin = catchAsync(async(req, res, next)=>{
  const {distance , latlng, unit }= req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit ==='mi' ? distance/3963.2 : distance/6378.1;
  if(!lat || !lng){
    return next(new AppError('The location points are not correct',400));
  }
  const tours = await Tour.find({ startLocation: {$geoWithin: { $centerSphere: [[lng, lat], radius]}}})
  res.status(200).json({
    status:"success",
    results : tours.length,
    data:{
      tours
    }
  })
});

exports.getDistances = catchAsync(async (req, res, next)=>{
  const { latlng, unit }= req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit ==='mi'? 0.000621371 : 0.001;
  if(!lat || !lng){
    return next(new AppError('The location points are not correct',400));
  }
  const distances = await Tour.aggregate([{
    $geoNear:{
      near:{
        type:'Point',
        coordinates:[lng*1, lat*1]
      }, distanceField:'distance',
        distanceMultiplier:multiplier
    }
  },{
    $project:{
      name:1,
      distance:1,
    }
  }])

  res.status(200).json({
    status:"success",
    results : distances.length,
    data:{
      distances
    }
  })
})