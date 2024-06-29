const User=require('../model/User')
const mailSender=require('../utils/mailSender');


// resetPassword Token
exports.ressetPasswordToken=async (req,res)=>{
    try{
   const {email}=req.body;
//    check user for this email and validation
const user= await User.findOne({email:email});
if(!user){
    return res.status().json({
        success:false,
        message:"This email is not registered with any User",
    })
}
// generate token
const token=crypto.randomUUID();
// update user for token and expires time
const updateDetails=await User.findOneAndUpdate({email:email},{
     token:token,
     resetPasswordExpires:Date.now()+5*60*1000
},
{new:true})
// create url
await mailSender(email,"Reset Password Link",` Reset Password Link : ${url}`)
// send email containing the url
// return rsponse



    const url=`http://localhost:3000/update-password/${token}`;

    }
    catch(error){

    }
}