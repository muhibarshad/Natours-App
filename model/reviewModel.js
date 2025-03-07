const mongoose = require('mongoose');
const Tour = require('./tourModel');
const reviewSchema = mongoose.Schema({
    review :{
        type : String, 
        required:[true, 'A review cannot be empty'],
    },
    createdAt:{
        type :Date,
        default:Date.now
    },
    rating:{
        type :Number,
        default : 4.7,
        max:[5, 'A tour must have rating less than equal to 5'],
        min:[1, 'A tour must have rating greater than equal to 1'],
    },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'A review must belong to the tour']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'A review must belong to the user']
    }
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

reviewSchema.index({tour:1 , user:1},{unique:true});

reviewSchema.pre(/^find/,function(next){
    this.populate({
        path:'user',
        select:'name photo'
    })
    // this.populate({
    //     path:'tour',
    //     select:'name'
    // }).populate({
    //     path:'user',
    //     select:'name photo'
    // })
    next();
})

reviewSchema.statics.calculateAvergeRatings =async function(TourID){
    const stats = await this.aggregate([
        {
            $match :{tour: TourID}
        },
        {
            $group:{
                _id : '$tour',
                nRatings:{$sum :1},
                avgRating:{$avg:'$rating'}
            }
        }
    ])
 if(stats.length>0){
    await Tour.findByIdAndUpdate(TourID,{
        ratingsAverage:stats[0].avgRating,
        ratingsQuantity:stats[0].nRatings
    })
 }else{
    await Tour.findByIdAndUpdate(TourID,{
        ratingsAverage:4.5,
        ratingsQuantity:0
    })  
 }
}
reviewSchema.pre(`^findOneAnd`, async function(next){
   this.r= await this.findOne();
    next();
})
reviewSchema.post(`^findOneAnd`, async function(){
    await this.r.constructor.calculateAvergeRatings(this.r.tour)
})

reviewSchema.post('save',function(){
    this.constructor.calculateAvergeRatings(this.tour)
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;