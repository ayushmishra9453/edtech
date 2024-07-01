const Course = require("../model/Course");
const Tag = require("../model/Tag");
const User = require("../model/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create course handler function

exports.createCourse = async (req, res) => {
  try {
    //  data fetch
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;
    // file fetch
    const thumbnail = req.files.thumbnailImage;

    // validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // checkforInstructor
    const userId = req.User.id;
    const instructorDetails = await User.findById(userId);
    console.log("InstructurDetails", instructorDetails);
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details not found",
      });
    }
    // check  given tag is valid or not
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Tag Details not found",
      });
    }
    // upload image top cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.Fo
    );
    //    create new Course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });
    // add the new course to the user schema of the instructor
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );
    // update the tag schema

    // return response
    return res.status(200).json({
        success:true,
        message:"Course created successfull",
        data:newCourse,
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
        success:false,
        message:"Course creation unsuccessful"
    })
  }
};

// getAll course handler function

exports.showAllCourses=async(req,res)=>{
    try{
    const allCourse=await Course.find({},{
        courseName:true,
        price:true,
        thumbnail:true,
        instructor:true,
        ratingAndReviews:true,
        studendEnrolled:true,
    }).populate("instructor").exec();

    return res.status(200).json({
        success:true,
        message:"All course get successfully",
        data:data
    })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot fetch data",
            error:error.message
        })
    }
}
