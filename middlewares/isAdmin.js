const User = require("../model/User/User");
const appError = require("../utils/appError");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

const isAdmin = async (req, res, next) => {
  //get token from header
  const token = getTokenFromHeader(req);

  //verify the token
  const decodedToken = verifyToken(token);

  //save the user info the request
  req.userAuth = decodedToken.id;

  //find the user inside the db
  const user = await User.findById(decodedToken.id);

  //check the user isAdmin
  if (user.isAdmin) {
    return next();
  } else {
    return next(appError("Access Denied Admin Only", 403));
  }
};

module.exports = isAdmin;
