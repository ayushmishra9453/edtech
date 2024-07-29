const Profile=require('../model/Profile');
const User=require('../model/User')

exports.updateProfile=async(req,res)=>{
    try{
        // get data
        const {dateOfBirth="",about="",contactNumber,gender}=req.body;
        // get userid
             const id=req.User.id
        // validation
        if(!contactNumber|| !gender || !id){
            return res.status(400).json({
                success:false,
                message:"Contact Number or gender is not given"
            })
        }
        // find profile
        const userDetails=await User.findById(id);
        const profileId=userDetails.additionalDetails;
        const ProfileDetails=await Profile.findById(profileId);
        // updateProfilr
        ProfileDetails.dateOfBirth=dateOfBirth;
        ProfileDetails.about=about;
        ProfileDetails.gender=gender;
        ProfileDetails.contactNumber=contactNumber;
        await ProfileDetails.save();
        // return response
           return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            ProfileDetails
           })

    }
    catch(error){
    return res.status(500).json({
        success:true,
        message:"Profile updation unsuccessfully",
        error:error.message
    })
    }
}

// delete accounts

exports.deleteAccount=async(req,res)=>{
    try{
    //  get id
     const id=req.User.id
    // validation
    const userDetails=await User.findById(id)
    if(!userDetails){
        return res.status(400).json({
            success:false,
            message:"User not found"
        })
    }
    // delete profile of user
    await Profile.findByIdAndDelete({_id:userDetails.additionalDetails})
    // homework ->unrolled user from all enrolled courses
    // delete user
    await User.findByIdAndDelete({_id:id});

    // return response

    return res.status(200).json({
        success:true,
        message:"User Deleted successfully"
    })

    }
    catch(error){
   return res.status(500).json({
    success:false,
    message:"Account deletion unsuccessful"
   })
    }
}

exports.getAllUserDetails=async(req,res)=>{
    try{
    const id=req.User.id;

    const userDetails=await User.findById(id).populate(additionalDetails).exec();
    return res.status(200).json({
        success:true,
        message:"user Data fetched successfully"
    })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Get all details"
           })
    }
}