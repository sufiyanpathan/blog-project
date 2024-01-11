const express = require("express");

const userRouter = require("./routes/users/userRoute");
const postRouter = require("./routes/posts/postRoute");
const commentRouter = require("./routes/comments/commentRoute");
const categoriesRouter = require("./routes/categories/categoriesRoute");
const globalErrHandler = require("./middlewares/globalErrorHandler");
const pageNotFound = require("./middlewares/global404");

require("dotenv").config();
require("./config/dbConnect");

const app = express();

//middlewares
const userAuth = {
  isLogin: true,
  isAdmin: true,
};

app.use(express.json()); //Pass incoming payload
// app.use((req, res, next) => {
//   if (userAuth.isLogin && userAuth.isAdmin) {
//     next();
//   } else {
//     return res.json({
//       msg: "Invalid",
//     });
//   }
// });
//----------------Route-----------------//
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/categories", categoriesRouter);
//---------------Route End---------------//

//-------------Error handle middleware------------//
app.use(globalErrHandler);

//------------404 Error---------------------------//
app.use("*", pageNotFound);
//----------------listen to server----------------//

const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`Server is up and running on ${PORT}`));

//-------------------End server-------------------//
