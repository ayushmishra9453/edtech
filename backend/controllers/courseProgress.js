const mongoose=require('mongoose')
const Section=require('../model/Section')
const SubSection=require("../model/SubSection")
const CourseProgress=require("../model/CourseProgress")
const Course=require('../model/Course')

exports.updateCourseProgress=async(req,res)=>{
    const {courseId, subSectionId}=req.body;
    const userId=req.user.id;
    try{
    const subsection=await SubSection.findById(subSectionId);
    if(!subsection){
        return res.status(400).json({
            error:"Invalid SubSection"
        })
    }

    // find the course progress document for the user and the course
    let courseProgress=await CourseProgress.findOne({
        courseId:courseId,
        userId:userId
    })

    if(!courseProgress){
        return res.status(404).json({
            success:false,
            message:"Course Progress does not exist"
        })
    }else{
        // if course progress exists, check if subsection is already completed
        if(courseProgress.completedVideos.includes(subSectionId))
        {
            return res.status(400).json({ error: "Subsection already completed" })
        }
         // Push the subsection into the completedVideos array
      courseProgress.completedVideos.push(subsectionId)
    }
      // Save the updated course progress
      await courseProgress.save()

      return res.status(200).json({ message: "Course progress updated" })
    }
    catch(error){
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}