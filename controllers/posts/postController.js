const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");

//Create Post
const createPost = async (req, res) => {
  const { title, description } = req.body;
  try {
    //1. Find the user creating the post
    const author = await User.findById(req.userAuth);

    //2. Create a post
    const postCreated = await Post.create({
      title,
      description,
      user: author._id,
    });

    //3. Associate user to a post - Push the post into the user post field
    author.posts.push(postCreated);
    await author.save();
    res.json({
      status: "success",
      data: postCreated,
    });
  } catch (error) {
    next(appError(error.message));
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
