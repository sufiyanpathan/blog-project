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
  followingController,
  unFollowController,
  blockUser,
  unblockUser,
  adminBlockUser,
  adminUnBlockUser,
  updatePassword,
} = require("../../controllers/users/userController");
const isLogin = require("../../middlewares/isLogin");
const multer = require("multer");
const storage = require("../../config/cloudinary");
const isAdmin = require("../../middlewares/isAdmin");
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
userRouter.delete("/", isLogin, userDelete);

//Update/api/v1/users
userRouter.put("/", isLogin, userUpdate);

//POST/api/v1/users/profile-photo-upload
userRouter.post(
  "/profile-photo-upload",
  isLogin,
  upload.single("profile"),
  userProfileUpdate
);

//GET/api/v1/users/profile-viewers/:id
userRouter.get("/profile-viewers/:id", isLogin, whoViewedMyProfile);

//GET/api/v1/users/following/:id
userRouter.get("/following/:id", isLogin, followingController);

//GET/api/v1/users/unfollowing/:id
userRouter.get("/unfollowing/:id", isLogin, unFollowController);

//GET/api/v1/users/block-user/:id
userRouter.get("/block-user/:id", isLogin, blockUser);

//GET/api/v1/users/unblock-user/:id
userRouter.get("/unblock-user/:id", isLogin, unblockUser);

//PUT/api/v1/users/admin-block-user/:id
userRouter.put("/admin-block-user/:id", isLogin, isAdmin, adminBlockUser);

//PUT/api/v1/users/admin-unblock-user/:id
userRouter.put("/admin-unblock-user/:id", isLogin, isAdmin, adminUnBlockUser);

//PUT/api/v1/users/update-password/:id
userRouter.put("/update-password", isLogin, updatePassword);

module.exports = userRouter;
