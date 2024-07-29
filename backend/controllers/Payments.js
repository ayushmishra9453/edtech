const {instance}=require('../config/razorpay');
const Course=require('../model/Course')
const User=require('../model/User')
const mailSender=require('../utils/mailSender')
const {courseEnrollmentEmail}=require('../mail/template/courseEnrollmentEmail');
const mongoose = require('mongoose');

// capture the payment and initiate the razorpay order

exports.capturePayments=async(req,res)=>{
    try{
    // get course id and user id
    const {course_id}=req.body;
    const userId=req.user.id;

    // validation
    if(!course_id){
        return res.status(400).json({
            success:false,
            message:"Course id not found"
        })
    }
    //  validCourse Id
    // validCourse Detail
    let course;
    course=await Course.findById(course_id);
    if(!course){
        return res.status(400).json({
            success:false,
            message:"could not find the course"
        })  
    }
    // check user has not already payed for the course
   const uId=new mongoose.Types.ObjectId(userId)
   if(course.studendEnrolled.includes(uid)) {
    return res.status(400).json({
        success:false,
        message:"Student is already enrolled"
    })
   }
    // order create
    const amount=course.price;
    const currency="INR"
    const options={amount:amount*100, currency,receipt:Math.random(Date.now()).toString(),
        notes:{courseId:course_id,userId}
    }

    try{
    // initiate the payment using razorpay
    const paymentResponse= await instance.orders.create({
        options
    })
    console.log(paymentResponse);
    }catch(error){
        return res.status(400).json({
            success:false,
            message:"Payment Response not created"
        })
    }
    // return response

    return res.status(200).json({
        success:true,
        courseName:course.courseName,
        courseDescription:course.courseDescription,
        thumbnail:course.thumbnail,
        orderId:paymentResponse.id,
        currency:paymentResponse.currency,
        amount:paymentResponse.amount
    })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// verify signature of razorpay and server
exports.verifySignature=async(req,res)=>{
    const webhookSecret="12345678";
    const signature=req.headers["x-razorpay-signature"];

    const shaSum= crypto.createHmac("sha256",webhookSecret);
    shaSum.update(JSON.stringify(req.body));
    const digest=shaSum.digest("hex");

    if(signature==digest){
        console.log("Payment is authorised");

        const {courseId,userId}=req.body.payload.entity.notes;
        try{
        //  fulfill the action
        // find the course and enroll the course
        const enrolledCourse=await Course.findOneAndUpdate(
            {_id:courseId},
            {
                $push:{
                    studendEnrolled:userId
                }
            },
            {new:true}
        )

        if(!enrolledCourse){
            return res.status(500).json({
                success:false,
                message:"Course not found"
            })
        }
        console.log(enrolledCourse);

        // find the student and add course list of enrolled courses
        const enrolledStudent= await User.findOneAndUpdate(
            {
                _id:userId
            },
            {$push:{
                courses:courseId
            }},
            {new:true}
        )
        console.log(enrolledStudent);

        // mail send kardo confirmation wala
        const emailResponse=await mailSender(enrolledStudent.email,
            "Congratulation from StudyNotion",
            "Congratulation you enrolled into new Course"
        )

        console.log(emailResponse);
       return res.status(200).json({
        success:true,
        message:"Signature verified and Course added"
       })
        }
        catch(error){
  console.log(error);
  return res.status(500).json({
    success:false,
    message:error.message
  })
        }
    }
    else{
        return res.status(400).json({
            success:false,
            message:"Invalid request"
        })
    }
}