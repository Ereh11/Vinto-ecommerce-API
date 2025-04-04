const sendResponse = (res, status, code, data, msg, totalpages = 1) => {
  res.status(code).json({
    status,
    code,
    data: data !== null ? { ...data } : data,
    message: { text: msg },
    totalPages: totalpages,
  });
};
module.exports = sendResponse;




