const express = require("express");
const {
  register,
  login,
  profile,
  users,
  userDelete,
  userUpdate,
  userProfileUpdate,
} = require("../../controllers/users/userController");
const isLogin = require("../../middlewares/isLogin");
const multer = require("multer");
const storage = require("../../config/cloudinary");
const userRouter = express.Router();

const upload = multer({ storage });

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

//POST/api/v1/users/profile-photo-upload
userRouter.post(
  "/profile-photo-upload",
  isLogin,
  upload.single("profile"),
  userProfileUpdate
);

module.exports = userRouter;
