const express=require('express')
const router=express.Router();

const {
    login,
    signup,
    sendotp,
    changePassword
}=require("../controllers/Auth")

const {
    resetPasswordToken,
    resetPassword
}=require("../controllers/ResetPassword")

const {auth}=require("../middlewares/auth")

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// routes for user login
router.post("/login",login);

// route for user signup
router.post("/signup",signup)

// route for sending otp

router.post("/sendotp",sendotp)

// route for changing password
router.post("/changepassword",auth,changePassword);


// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// route for generating a reset password token

router.post("/reset-password-token",resetPasswordToken);
// route for reseting user password after verification
router.post("/reset-password",resetPassword);

module.exports=router

