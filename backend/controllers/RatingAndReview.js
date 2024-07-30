const RatingAndReview= require('../model/RatingAndReview')
const Course=require('../model/Course')


// create rating 
exports.createRating=async(req,res)=>{
    try{
//    get user id

const userId=req.user.id;

//  fetch data from req body
const {rating , revieew, courseid}=req.body;
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

// get all rating
