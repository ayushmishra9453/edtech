const User = require("../model/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

// resetPassword Token
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;
    //    check user for this email and validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "This email is not registered with any User",
      });
    }
    // generate token
    const token = crypto.randomUUID();
    // update user for token and expires time
    const updateDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );
    // create url
    const url = `http://localhost:3000/update-password/${token}`;
    // send email containing the url
    await mailSender(
      email,
      "Reset Password Link",
      ` Reset Password Link : ${url}`
    );
    // return rsponse
    return res.status(200).json({
      success: true,
      message:
        "Email sent successfully, please check email and change password",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Something went wrong in reset password token",
    });
  }
};

// reset Password
exports.resetPassword = async (req, res) => {
  try {
    // data fetch
    const { password, confirmPassword, token } = req.body;
    // validation
    if (password !== confirmPassword) {
      return res.status(401)({
        success: false,
        message: "Password and Confirm password not matching",
      });
    }
    // get user credential from db using token
    const userDetails = await User.findOne({ token: token });
    // if no entry invalid token
    if (!userDetails) {
      return res.status(401).json({
        success: false,
        message: "token invalid",
      });
    }
    // token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(402).json({
        success: false,
        message: "Token is expired , Please regenerate your token ",
      });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );
    // retur n response

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Something wrong in reset Password",
    });
  }
};
