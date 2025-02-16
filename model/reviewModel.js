const mongoose = require('mongoose');
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
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;