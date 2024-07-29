const SubSection = require("../model/SubSection");
const Section = require("../model/Section");
const {uploadImageToCloudinary}=require('../utils/imageUploader')
// create subsection

exports.createSubsection = async (req, res) => {
  try {
    // fetch data from req body
    const { sectionId, title, timeDuration, description } = req.body;

    // extract file/video
    const video = req.files.videoFile;
    // data validation
    if (!sectionId || !title || !timeDuration || description || !video) {
      return res.status(500).json({
        success: false,
        message: "All fields are requireds ",
        // error:error.message
      });
    }
    // upload video on cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    // create subsection
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });
    // push subsection id in section
    const updatedSection=await Section.findByIdAndUpdate({_id:sectionId},
        {$push:{
            subSection:SubSectionDetails._id,
        }},
        {new:true}
    )
    // homework ->log updated section here after adding populate query

    // return response
    return res.status(200).json({
        success:false,
        message:'Sub section created successfully',
        updatedSection,
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Sub Section creation unsuccessfully ",
      error: error.message,
    });
  }
};

// Homework updateSubsection and deleteSubsection

exports.updateSubSection=async(req,res)=>{
  try{
// fetch data
  const {subSectionId,title,timeDuration,description}=req.body;
  // validation
  if(!subSectionId|| !title ||!timeDuration ||!description){
    return res.status(400).json({
      success:false,
      message:"Subsection id is not provided"
    })
  }
  //  update data

  const subSectionData=await SubSection.findByIdAndUpdate(subSectionId,{title,timeDuration,description},{new:true})
  return res.status(200).json({
    success:true,
    message:" Sub Section updated successfully",
    // updatedCourseDetails
})
  }
  catch(error){
    return res.status(500).json({
      success:false,
      message:"Error in update Section",
      error:error.message
    })
  }
}

exports.deleteSubSection=async(req,res)=>{
  try{
const {subSectionId,sectionId}=req.body;

if(!subSectionId){
  return res.status(400).json({
    success:false,
    message:"Enter valid Sub Section Id"
  })
}

await SubSection.findByIdAndDelete(subSectionId)
await Section.findByIdAndUpdate(
  { _id: sectionId },
  { $pull: { subSection: subSectionId } },
  { new: true }
);
return res.status(200).json({
  success:false,
  message:"Subsection deleted successfully"
})
  }
  catch(error){
    return res.status(500).json({
      success:false,
      message:"Error in deleting Sub section"
    })
  }
}
