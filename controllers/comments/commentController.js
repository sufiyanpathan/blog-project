//Create Comment
const createComment = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "comment added successfully",
    });
  } catch (error) {
    res.json(error.message);
  }
};

//Get Single Comment
const getComment = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "single comment details",
    });
  } catch (error) {
    res.json(error.message);
  }
};

//Delete Comment
const deleteComment = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "single comment deleted successfully",
    });
  } catch (error) {
    res.json(error.message);
  }
};

//Update Comment
const updateComment = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "single comment updated successfully",
    });
  } catch (error) {
    res.json(error.message);
  }
};

module.exports = {
  createComment,
  getComment,
  deleteComment,
  updateComment,
};
