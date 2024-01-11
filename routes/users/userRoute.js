const express = require("express");
const {
  register,
  login,
  profile,
  users,
  userDelete,
  userUpdate,
  userProfileUpdate,
  whoViewedMyProfile,
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

//POST/api/v1/users/profile-viewers/:id
userRouter.get("/profile-viewers/:id", isLogin, whoViewedMyProfile);

module.exports = userRouter;
