module.exports = (req, res, next) => {
  const { title } = req.body;
  if (!title?.trim()) {
    return res.status(400).json({
      status: "FAIL",
      code: 400,
      data: { category: null },
      message: "Title is required",
    });
  }
  next();
};
