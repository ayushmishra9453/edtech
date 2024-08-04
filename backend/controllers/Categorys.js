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
    .populate("courses")
    .exec();
    //  validation
    if(!selectedCategory){
      return res.status(404).json({
        success:false,
        message:"Data not found"
      })
    }

    // get courses for different categories
    const differentCategory=await Category.find({
      _id:{$ne:categoryId}
    })
    .populate("courses")
    .exec();
    // homework--> get top selling courses
    
  //  return response
  return res.status(200).json({
    success:true,
    data:{
      selectedCategory,
      differentCategory
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
