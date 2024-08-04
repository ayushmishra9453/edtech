const RatingAndReview= require('../model/RatingAndReview')
const Course=require('../model/Course');
const { default: mongoose } = require('mongoose');


// create rating 
exports.createRating=async(req,res)=>{
    try{
//    get user id

const userId=req.user.id;

//  fetch data from req body
const {rating , review, courseid}=req.body;
// check if user is enrolled or not

const courseDetails=await Course.findOne({_id:courseid,
    studendEnrolled:{$elemMatch:{$eq:userId}}
},

)
if(!courseDetails){
    return res.status(400).json({
        success:false,
        message:"Student is not enrolled in course"
       })
}
// check if user is not allready given review
const alreadyReviewed=await RatingAndReview.findOne({
    user:userId,
    course:courseId  
})
// creater rating 
if(alreadyReviewed){
    return res.status(403).json({
        success:false,
        message:"Course is already reviewed by the user"
       })
}

const ratingReview=await RatingAndReview.create({rating,review,
    course:courseId,
    user:userId
})
// update course
const updatedCourseDetails=await Course.findByIdAndUpdate({_id:courseId},{
    $push:{
      ratingAndReviews:ratingReview._id,  
    }
},
{new:true})
// return response 
return res.status(200).json({
    success:true,
    message:"Rating and Review created successfully",
    ratingReview,
   })


    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
           })
    }
}

// get average rating 
exports.getAverageRating=async(req,res)=>{
    try{
    // get courseId
    const courseId=req.body.courseId;

    // calculate Average Rating

    const result=await RatingAndReview.aggregate({
      $match:{
        course:new mongoose.Types.ObjectId(courseId)
      }  
    },
{
    $group:{
        _id:null,
        averageRating:{
            $avg:"$rating"   

        }
    }
})
    // return rating
    if(result.length>0){
        return res.status(200).json({
            success:true,
            averageRating: result[0].averageRating, 
        })
    }
    // if no rating review exists
    return res.status(200).json({
        success:true,
        message:'Average rating is 0, no rating till now '
    })

    }catch(error){

    }
}
// get all rating

exports.getAllRatingAndReview=async(req,res)=>{
    try{
    const allReviews=await RatingAndReview.find({})
 .sort({rating:"desc"})
  .populate({
    path:"user",
    select:"firstName lastName email image",
  })  
.populate({
    path:"course",
    select:"courseName"
})
.exec();  
// return response
return res.status(200).json({
    success:true,
    message:"All reviews fetched successfully",
    data:allReviews
})
}
    catch(error){
    return res.status(200).json({
        success:true,
        message:error.message
    })
    }
}
