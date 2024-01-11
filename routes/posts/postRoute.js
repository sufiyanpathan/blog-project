const express = require("express");
const {
  createPost,
  getPost,
  getAllPost,
  deletePost,
  updatePost,
} = require("../../controllers/posts/postController");

const postRouter = express.Router();

//POST/api/v1/posts/register
postRouter.post("/", createPost);

//GET/api/v1/posts/:id
postRouter.get("/:id", getPost);

//GET/api/v1/posts
postRouter.get("/", getAllPost);

//Del/api/v1/posts/:id
postRouter.delete("/:id", deletePost);

//Update/api/v1/posts/:id
postRouter.put("/:id", updatePost);

module.exports = postRouter;
