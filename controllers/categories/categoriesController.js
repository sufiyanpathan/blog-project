//Create Category
const createCategory = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "categories added successfully",
    });
  } catch (error) {
    res.json(error.message);
  }
};

//Get Category
const getCategory = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "single category details",
    });
  } catch (error) {
    res.json(error.message);
  }
};

//Delete Category
const deleteCategory = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "single category deleted successfully",
    });
  } catch (error) {
    res.json(error.message);
  }
};

//Update Category
const updateCategory = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "single categories updated successfully",
    });
  } catch (error) {
    res.json(error.message);
  }
};

module.exports = {
  createCategory,
  getCategory,
  deleteCategory,
  updateCategory,
};
