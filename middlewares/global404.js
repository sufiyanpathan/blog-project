const pageNotFound = (req, res) => {
  res.status(404).json({
    message: `${req.originalUrl} - Route Not Found`,
  });
};
module.exports = pageNotFound;
