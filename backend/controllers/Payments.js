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

// send payment success email
exports.sendPaymentSuccessEmail=async(req,res)=>{

    const {orderId,paymentId,amount}=req.body;
    const userId=req.user;
    if (!orderId || !paymentId || !amount || !userId) {
        return res
          .status(400)
          .json({ success: false, message: "Please provide all the details" })
      }
    try{
        const enrolledStudent = await User.findById(userId)
        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                amount / 100,
                orderId,
                paymentId
            )
        )
    }
    catch(error){
        console.log("error in sending mail", error)
        return res
          .status(400)
          .json({ success: false, message: "Could not send email" })
    }
}

const enrollStudent=async(req,res)=>{
    if (!courses || !userId) {
        return res
          .status(400)
          .json({ success: false, message: "Please Provide Course ID and User ID" })
      }

      for(const courseId of courses){
        try{
    // find the course and enroll the student in it
    const enrolledCourse=await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnroled: userId } },
        { new: true }
    )
    if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" })
      }

      console.log("Updated course: ", enrolledCourse)
      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      })
      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      )

      console.log("Enrolled student: ", enrolledStudent)
      // Send an email notification to the enrolled student
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      )

      console.log("Email sent successfully: ", emailResponse.response)
        }
        catch(error){
            console.log(error)
            return res.status(400).json({ success: false, error: error.message })
        }
      }
}