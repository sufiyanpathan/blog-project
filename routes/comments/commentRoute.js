const express = require("express");
const {
  createComment,
  getComment,
  deleteComment,
  updateComment,
} = require("../../controllers/comments/commentController");

const commentRouter = express.Router();

//POST/api/v1/comments
commentRouter.post("/", createComment);

//GET/api/v1/comments/:id
commentRouter.get("/:id", getComment);

//Del/api/v1/comments/:id
commentRouter.delete("/:id", deleteComment);

//Update/api/v1/comments/:id
commentRouter.put("/:id", updateComment);
module.exports = commentRouter;
