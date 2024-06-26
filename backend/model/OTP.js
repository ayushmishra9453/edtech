const mongoose=require('mongoose')

const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true  
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
    }
})


//  a function to send email

async function sendVerificationMail(email,otp){
    try{
    const mailResponse=await mailSender(email,"Verification mail fromm StudyNotion",otp);
    console.log("Email sent successfully",mailResponse);
    }
    catch(error){
    console.log("Error in sending Email",error);
    throw error;
    }
}

OTPSchema.pre("save",async function(next){
    await sendVerificationMail(this.email,this.otp);
})
module.exports=mongoose.model("OTP", otpSchema);