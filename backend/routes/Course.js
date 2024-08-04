const express=require('express')
const router=express.Router()

const {
    createCourse,
    getAllCourse,
    getCourseDetails,
    getFullCourseDetails,
    editCourse,
    getInstructorCourses,
    deleteCourse
}=require("../controllers/Course")

const {
    createCategory,
    showAllCategorys,
    categoryPageDetails
}=require("../controllers/Categorys");

const {
    createSection,
    updateSection,
    deleteSection
}=require("../controllers/Section")

const {
    createSubsection,
    updateSubSection,
    deleteSubSection
}=require('../controllers/SubSection')

const {
    createRating,
    getAverageRating,
    getAllRatingAndReview
}=require('../controllers/RatingAndReview')

const {
    updateCourseProgress
}=require("../controllers/courseProgress")

const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")


// course Routes

// Courses can Only be Created by Instructors
router.post("/createCourse",auth,isInstructor,createCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// update a section
router.post("/updateSection",auth, isInstructor,updateSection)
// Delete a Section
router.post("/deleteSection",auth,isInstructor,deleteSection);
// edit subsection
router.post("/updateSubSection",auth,isInstructor,updateSubSection);
// delete subsection
router.post("/deleteSubSection",auth,isInstructor,deleteSubSection);
// add a subsection to a section
router.post("addSubSection",auth,isInstructor,createSubsection);
// get all registered courses
router.get("/getAllCourses",getAllCourse)
// get details of a specific course
router.post("/getCourseDetails",getCourseDetails)
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Delete a Course
router.delete("/deleteCourse", deleteCourse)
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router