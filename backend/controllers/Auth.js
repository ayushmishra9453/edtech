const User = require("../model/User");
const OTP = require("../model/OTP");
const OTPGenerator = require("otp-generator");
const otpGenerator = require("otp-generator");
const bcrypt=require('bcrypt')
const Profile = require('../model/Profile')
const jwt=require("jsonwebtoken")
require("dotenv").config();
// send otp
exports.sendOTP = async (req, res) => {
  try {
    // fetch email from body
    const { email } = req.body;
    // check if user alredy exist

    const checkUserPresent = await User.findOne({ email });
    // if user alredy exist then return response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exist",
      });
    }

    // generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("otp generated", otp);

    // check otp is unique or not
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });

      const otpPayload = { email, otp };
      //  create an entry in db
      const otpBody = await OTP.create(otpPayload);
      console.log(otpBody);

      // return response successfully
      res.status(200).json({
        success: true,
        message: "OTP send Successfully",
        otp,
      });
    }
  } catch (error) {
    console.log("otp generation error", error);
    res.status(500).json({
      success: false,
      message: "otp send error",
    });
  }
};

// SignUp

exports.signUp = async(req, res) => {
  try{
    // data fetch from req body
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    accountType,
    contactNumber,
    otp,
  } = req.body;

  // data ko  validate karna
   if(!firstName || !lastName ||!email || !password||!confirmPassword||!otp){
    return res.status(403).json({
      success:false,
      message:"All fields are required"
    })
   }
  // check both password
  if(password !==confirmPassword){
    return res.status(400).json({
        success:false,
        message:"Password and Confirm Password are not Same"
    })
  }
  // check user already exist
    const existingUser=await User.findOne({email})
    if(existingUser){
        return res.status(401).json({
            success: false,
            message: "User already exist",
          });  
    }
  // check most recent otp
   const recentOtp=await OTP.find({email}.sort({createdAt:-1}).limit(1));
   console.log('recent otp',recentOtp);
  // validate otp
   if(recentOtp.length==0){
    return res.status(400).json({
        success:false,
        message:"OTP not found",
    });
   } 
   else if(otp!==recentOtp){
    return res.status(400).json({
        success:false,
        message:"Invalid OTP"
    })
   }


  // hash password
   const hashedPassword=await bcrypt.hash(password,10);
  // entry create in db
    const profileDetail=await Profile.create({
     gender:null,
     DateOfBirth:null,
     about:null,
     contactNumber:null,
    });

  const user=await User.create({
    firstName,
    lastName,
    email, 
    contactNumber,
    password:hashedPassword,
    accoutType,
    additionalDetails:profileDetail._id,
    image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
  })
  return res.status(400).json({
    success:true,
    message:"User is registered successfully",
    user
  })
  
  }
  catch(error){
    console.log(error);
    console.log("signUp mein error aa raha raha hai");
    return res.status(500).json({
   success:false,
   message:"SignUp mein error aa raha hai"
    })
  }
};

exports.login=async(req,res)=>{
try{
// data fetch
const {email,password}=req.body;
// validate data
if(!email ||!password){
  return res.status(403).json({
    success:false,
    message:"All field required, Please try again",
  })
}
// user check exist or no
const user=await User.findOne({email}).populate("additionalDetails");
if(!user){
return res.status(401).json({
  success:false,
  message:"User is not registered , Please register first",
})
}
// generate jwt token after password match
 if(await bcrypt.compare(password,user.password)){
  const payload={
    email:user.email,
    id:user._id,
    role:user.role
  }
  const token=jwt.sign(payload,process.env.JWT_SECRET,{
    expiersIn:"2h"
  });
  user.token=token;
  user.password=undefined;
// create cookie and send response
const options={
  expires:new Data(Date.now()+3*24*60*60*1000),
  httpOnly:true,
}
res.cookie("token",token,options).status(200).json({
  success:true,
  token,
  user,
  message:"LoggedIn suuccessfullt"
})

}
else{
return res.status(401).json({
success:false,
message:"Password is Incorrect",
})
}


}
catch(error){
  return res.status(500).json({
    success:false,
    message:"Login Failure please try again",
    })
}
}

// change password

exports.changePassword=async(req,res)=>{

}