const sendResponse = (res, status, code, data, message) => {
  res.status(code).json({
    status,
    code,
    data: data !== null ? { ...data } : data,
    message: { text: message },
  });
};

module.exports = sendResponse;




