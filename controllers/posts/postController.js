//Create Post
const createPost = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "post created successfully",
    });
  } catch (error) {
    res.json(error.message);
  }
};

//Get Single Post
const getPost = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "single post details",
    });
  } catch (error) {
    res.json(error.message);
  }
};

//All Post
const getAllPost = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "all posts",
    });
  } catch (error) {
    res.json(error.message);
  }
};

//Delete Post
const deletePost = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "single post deleted successfully",
    });
  } catch (error) {
    res.json(error.message);
  }
};

//Update Post
const updatePost = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "single post updated successfully",
    });
  } catch (error) {
    res.json(error.message);
  }
};

module.exports = {
  createPost,
  getPost,
  getAllPost,
  deletePost,
  updatePost,
};
