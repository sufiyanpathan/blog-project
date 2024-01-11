const bcrypt = require("bcryptjs");
const User = require("../../model/User/User");
const generateToken = require("../../utils/generateToken");
const getTokenFromHeader = require("../../utils/getTokenFromHeader");
const appError = require("../../utils/appError");
//Register
const register = async (req, res, next) => {
  const { firstName, lastName, profilePhoto, email, password } = req.body;
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
      profilePhoto,
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

//All Users
const users = async (req, res) => {
  const user = await User.find();
  try {
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.json(error.message);
  }
};

//User delete
const userDelete = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "single user deleted successfully",
    });
  } catch (error) {
    res.json(error.message);
  }
};

//Update User
const userUpdate = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "single user updated successfully",
    });
  } catch (error) {
    res.json(error.message);
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
};
