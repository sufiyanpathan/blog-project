const express = require("express");
const {
  register,
  login,
  profile,
  users,
  userDelete,
  userUpdate,
} = require("../../controllers/users/userController");
const isLogin = require("../../middlewares/isLogin");

const userRouter = express.Router();

//POST/api/v1/users/register
userRouter.post("/register", register);

//POST/api/v1/users/login
userRouter.post("/login", login);

//GET/api/v1/users/profile/:id
userRouter.get("/profile/", isLogin, profile);

//GET/api/v1/users
userRouter.get("/", users);

//Del/api/v1/users/:id
userRouter.delete("/:id", userDelete);

//Update/api/v1/users/:id
userRouter.put("/:id", userUpdate);

module.exports = userRouter;
