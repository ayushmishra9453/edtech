const Section=require('../model/Section');
const Course=require('../model/Course')

exports.createSection=async(req,res)=>{
    try{
    // data fetch

    const {sectionName,courseId}=req.body;

    // data validation
    if(!sectionName || !courseId){
        return res.status(400).json({
            success:false,
            message:"missing properties"
        })
    }
    // create section
    const newSection=await Section.create({
        sectionName
    })
    // update course with section couse id
    const updatedCourseDetails= await Course.findByIdAndUpdate( courseId,
        {
            $push:{
                courseContent:newSection._id,
            }
        },
        {new:true}
    )
// HW:how to use populate function to populate both section and subsection
    // return response
    return res.status(200).json({
        success:true,
        message:"Section created successfully",
        updatedCourseDetails
    })
    
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to create section",
            error:error.message
        })
    }
}

exports.updateSection=async(req,res)=>{
    try{
//     data input
   const {sectionName,sectionId}=req.body;
// data validation
if(!sectionName || !sectionId){
    return res.status(400).json({
        success:false,
        message:"missing properties"
    })
}
// update data
  const section= await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true})
// return response
return res.status(200).json({
    success:true,
    message:"Section updated successfully",
    // updatedCourseDetails
})
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to update a section",
            error:error.message
        }) 
    }
}

exports.deleteSection=async(req,res)=>{
    try{
        // get id- assuming that we are sendin id in params
    const {sectionId,courseId}=req.params
    // find by id and delete
 await Section.findByIdAndDelete(sectionId);
//  Todo-> you need to delete the entry from the course schema
await Section.findByIdAndUpdate(
    { _id: courseId },
    { $pull: { section: sectionId } },
    { new: true }
  );

    // return response
    return res.status(200).json({
        success:true,
        message:"Section deleted successfully",
        // updatedCourseDetails
    })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to delete a section",
            error:error.message
        })  
    }
}