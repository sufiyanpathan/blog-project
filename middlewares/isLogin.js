const appError = require("../utils/appError");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

const isLogin = (req, res, next) => {
  //get token from header
  const token = getTokenFromHeader(req);

  //verify the token
  const decodedToken = verifyToken(token);

  //save the user info the request
  req.userAuth = decodedToken.id;

  if (!decodedToken) {
    return next(appError("Invalid/Expired token, please login back", 500));
  } else {
    next();
  }
};

module.exports = isLogin;
