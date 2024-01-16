const bcrypt = require("bcryptjs");
const User = require("../../model/User/User");
const Post = require("../../model/Post/Post");
const Comment = require("../../model/Comment/Comment");
const Category = require("../../model/Category/Category");
const generateToken = require("../../utils/generateToken");
const getTokenFromHeader = require("../../utils/getTokenFromHeader");
const appError = require("../../utils/appError");
//Register
const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    //check if email exists
    const userFound = await User.findOne({ email });
    if (userFound) {
      return next(appError("User already registered", 500));
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create the user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(appError(error.message, 500));
  }
};

//Login
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //check if email exists
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return next(appError("Invalid Username", 500));
    }

    //verify password
    const isPasswordMatched = await bcrypt.compare(
      password,
      userFound.password
    );

    if (!isPasswordMatched) {
      return next(appError("Invalid Password", 500));
    }

    res.status(201).json({
      status: "success",
      data: {
        firstName: userFound.firstName,
        lastName: userFound.lastName,
        email: userFound.email,
        isAdmin: userFound.isAdmin,
        token: generateToken(userFound._id),
      },
    });
  } catch (error) {
    next(appError(error.message, 500));
  }
};

//Profile
const profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userAuth);
    res.status(201).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(appError(error.message, 500));
  }
};

//Profile photo upload
const userProfileUpdate = async (req, res, next) => {
  try {
    //1. Find the user to be updated
    const userToUpdate = await User.findById(req.userAuth);

    //2. check if user found
    if (!userToUpdate) {
      return next(appError("User not found", 403));
    }

    //3. check if user is blocked
    if (userToUpdate.isBlocked) {
      return next(appError("Action not allowed, your account is blocked", 403));
    }

    //4. check if a user is updated their profile photo
    if (req.file) {
      //1. update profile photo
      await User.findByIdAndUpdate(
        req.userAuth,
        {
          $set: {
            profilePhoto: req.file.path,
          },
        },
        {
          new: true,
        }
      );
      res.json({
        status: "success",
        data: "You have successfully updated profile photo",
      });
    }
  } catch (error) {
    next(appError(error.message, 500));
  }
};

//User profile view
const whoViewedMyProfile = async (req, res, next) => {
  try {
    // 1. Find the original user
    const user = await User.findById(req.params.id);

    // 2. Find the user who viewed the original
    const userWhoViewed = await User.findById(req.userAuth);

    // 3. Check if original user and who viewed are found

    if (user && userWhoViewed) {
      // 4. Check if user who viewed is already in the user viewers array
      const isUserAlreadyViewed = user.viewers.find(
        (viewer) => viewer.toString() === userWhoViewed._id.toJSON()
      );

      if (isUserAlreadyViewed) {
        return next(appError("You already viewed this profile"));
      } else {
        // 5. Push the userWhoViewed to user's viewers array
        user.viewers.push(userWhoViewed._id);

        // 6. Save the user
        await user.save();

        res.json({
          status: "success",
          data: "you have successfully viewed this profile",
        });
      }
    }
  } catch (error) {
    next(appError(error.message));
  }
};

//User Following
const followingController = async (req, res, next) => {
  try {
    // 1. Find the user to follow
    const userToFollow = await User.findById(req.params.id);

    // 2. Find the user who is following
    const userWhoFollowed = await User.findById(req.userAuth);

    // 3. Check if user and userWhoFollowed are found

    if (userToFollow && userWhoFollowed) {
      // 4. Check if user who followed is already in the user followers array
      const isUserAlreadyFollowed = userToFollow.followers.find(
        (followers) => followers.toString() === userWhoFollowed._id.toJSON()
      );

      if (isUserAlreadyFollowed) {
        return next(appError("You already followed this user"));
      } else {
        // 5. Push userWhoFollowed to userToFollow followers array
        userToFollow.followers.push(userWhoFollowed._id);

        // 5. Push userToFollow to userWhoFollowed followers array
        userWhoFollowed.following.push(userToFollow._id);

        // 6. Save the user
        await userWhoFollowed.save();
        await userToFollow.save();

        res.json({
          status: "success",
          data: "you have successfully followed this user",
        });
      }
    }
  } catch (error) {
    next(appError(error.message));
  }
};

//User for Un-following
const unFollowController = async (req, res, next) => {
  try {
    // 1. Find the user to un-follow
    const userToUnFollow = await User.findById(req.params.id);

    // 2. Find the user who is unfollowing
    const userWhoUnFollowed = await User.findById(req.userAuth);

    // 3. Check if user and user want to unfollowed are found

    if (userToUnFollow && userWhoUnFollowed) {
      // 4. Check if user who unfollowed is already in the user followers array
      const isUserAlreadyFollowed = userToUnFollow.followers.find(
        (followers) => followers.toString() === userWhoUnFollowed._id.toJSON()
      );

      if (!isUserAlreadyFollowed) {
        return next(appError("You have not followed this user"));
      } else {
        //5. Remove user who unfollowed from the user's followers array
        userToUnFollow.followers = userToUnFollow.followers.filter(
          (follower) => follower.toString() !== userWhoUnFollowed._id.toString()
        );

        //save the user
        await userToUnFollow.save();

        //7. Removed user to be unfollowed
        userWhoUnFollowed.following = userWhoUnFollowed.following.filter(
          (following) => following.toString() !== userToUnFollow._id.toString()
        );

        //save the user
        await userWhoUnFollowed.save();
        res.json({
          status: "success",
          data: "you have successfully unfollowed this user",
        });
      }
    }
  } catch (error) {
    next(appError(error.message));
  }
};

//Block User
const blockUser = async (req, res, next) => {
  try {
    // 1. Find the user to ble block
    const blockUser = await User.findById(req.params.id); //Samah

    // 2. Find the user who is blocking
    const userWhoWantsToBlock = await User.findById(req.userAuth); // Admin

    //3 check if blockUser & userWhoWantsToBlock are found
    if (blockUser && userWhoWantsToBlock) {
      // 4. Check if blockUser is already in the userWhoWantsToBlock array
      const isUserAlreadyBlocked = userWhoWantsToBlock.blocked.find(
        (blocked) => blocked.toString() === blockUser._id.toString()
      );

      if (isUserAlreadyBlocked) {
        return next(appError("You have already blocked this user"));
      } else {
        // 5. Push the blockUser to userWhoWantsToBlock
        userWhoWantsToBlock.blocked.push(blockUser._id);

        // 6. Save the user
        await userWhoWantsToBlock.save();

        res.json({
          status: "success",
          data: "you have successfully blocked this user",
        });
      }
    }
  } catch (error) {
    next(appError(error.message));
  }
};

//Unblock User
const unblockUser = async (req, res, next) => {
  try {
    const userToBeUnblocked = await User.findById(req.params.id);
    const userWhoUnBlocked = await User.findById(req.userAuth);

    if (userToBeUnblocked && userWhoUnBlocked) {
      const isUserAlreadyBlocked = userWhoUnBlocked.blocked.find(
        (blocked) => blocked.toString() === userToBeUnblocked._id.toJSON()
      );

      if (!isUserAlreadyBlocked) {
        return next(appError("You have not blocked this user"));
      } else {
        userWhoUnBlocked.blocked = userWhoUnBlocked.blocked.filter(
          (blocked) => blocked.toString() !== userToBeUnblocked._id.toString()
        );
        // //save the user
        await userWhoUnBlocked.save();
        res.json({
          status: "success",
          data: "you have successfully unblocked this user",
        });
      }
    }
  } catch (error) {
    next(appError(error.message));
  }
};

//admin block
const adminBlockUser = async (req, res, next) => {
  try {
    //1. FIND THE USER TO BE BLOCKED
    const userToBeBlocked = await User.findById(req.params.id);

    //2. CHECK IF USER FOUND
    if (!userToBeBlocked) {
      return next(appError("User Not Found"));
    }

    //3. CHANGE THE isBlocked to true
    userToBeBlocked.isBlocked = true;

    //4. Save
    await userToBeBlocked.save();

    res.json({
      status: "success",
      data: "you have successfully blocked the user",
    });
  } catch (error) {
    next(appError(error.message));
  }
};

//admin un block
const adminUnBlockUser = async (req, res, next) => {
  try {
    //1. FIND THE USER TO BE UNBLOCKED
    const userToBeUnBlocked = await User.findById(req.params.id);

    //2. CHECK IF USER FOUND
    if (!userToBeUnBlocked) {
      return next(appError("User Not Found"));
    }

    //3. CHANGE THE isBlocked to false
    userToBeUnBlocked.isBlocked = false;

    //4. Save
    await userToBeUnBlocked.save();

    res.json({
      status: "success",
      data: "you have successfully unblocked this user",
    });
  } catch (error) {
    next(appError(error.message));
  }
};

//Updating user
const userUpdate = async (req, res, next) => {
  const { email, lastName, firstName } = req.body;
  try {
    // check if email not taken
    if (email) {
      const emailTaken = await User.findOne({ email });

      if (emailTaken) {
        return next(appError("Email is taken", 400));
      }
    }
    // update the user
    const user = await User.findByIdAndUpdate(
      req.userAuth,
      {
        lastName,
        firstName,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

//update password
const updatePassword = async (req, res, next) => {
  const { password } = req.body;
  try {
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await User.findByIdAndUpdate(
        req.userAuth,
        {
          password: hashedPassword,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.json({
        status: "success",
        data: "Password has been changed ! Successfully",
      });
    } else {
      return next(appError("Please provide password field"));
    }
  } catch (error) {
    next(appError(error.message));
  }
};

//All Users
const users = async (req, res) => {
  const user = await User.find();
  try {
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

//User delete
const userDelete = async (req, res, next) => {
  try {
    const userToDelete = await User.findById(req.userAuth);
    if (userToDelete) {
      await Post.deleteMany({ user: req.userAuth });

      await Comment.deleteMany({ user: req.userAuth });

      await Category.deleteMany({ user: req.userAuth });

      await userToDelete.deleteOne();

      return res.json({
        status: "success",
        data: "Your account has been deleted successfully",
      });
    } else {
      next(appError("No user found"));
    }
  } catch (error) {
    next(appError(error.message));
  }
};

module.exports = {
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
};
