const Category = require("../model/Category");

// Category ka handler

exports.createCategory = async (req, res) => {
  try {
    //   data fetch
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status().json({
        success: false,
        message: "All fields are required",
      });
    }
    // create entry in db
    const CategoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(CategoryDetails);
    //   return response
    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// getAllCategorys

exports.showAllCategorys = async (req, res) => {
  try {
    const allCategorys = await Category.find({}, { name: true, description: true });
    res.status(200).json({
      success: true,
      message: "All Categorys return successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.categoryPageDetails=async(req,res)=>{
  try{
    // get category id
    const categoryId=req.body;

    // fetch all courses with that category id
    const selectedCategory=await Category.find(categoryId)
    .populate({
      path: "courses",
      match: { status: "Published" },
      populate: "ratingAndReviews",
    })
    .exec();
    //  validation
    if(!selectedCategory){
      console.log("Category not found.")
      return res.status(404).json({
        success:false,
        message:"Data not found"
      })
    }

    // Handle the case when there are no courses
    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.")
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      })
    }

    // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    })

    // get courses for different categories
    let differentCategory=await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
      ._id
    )
    .populate({  path: "courses",
      match: { status: "Published" },})
    .exec();
    // homework--> get top selling courses
       // Get top-selling courses across all categories
       const allCategories = await Category.find()
       .populate({
         path: "courses",
         match: { status: "Published" },
         populate: {
           path: "instructor",
       },
       })
       .exec()
     const allCourses = allCategories.flatMap((category) => category.courses)
     const mostSellingCourses = allCourses
       .sort((a, b) => b.sold - a.sold)
       .slice(0, 10)
      // console.log("mostSellingCourses COURSE", mostSellingCourses)
  //  return response
  return res.status(200).json({
    success:true,
    data:{
      selectedCategory,
      differentCategory,
      mostSellingCourses,
    },
  });
  }
  catch(error){
    return res.status(200).json({
      success:false,
      message:error.message
    })
  }
}
