const Tag = require("../model/Tag");

// Tag ka handler

exports.createTag = async (req, res) => {
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
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);
    //   return response
    return res.status(200).json({
      success: true,
      message: "Tag created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// getAllTags

exports.showAllTags = async (req, res) => {
  try {
    const allTags = await Tag.find({}, { name: true, description: true });
    res.status(200).json({
      success: true,
      message: "All tags return successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
