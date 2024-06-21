const asyncHandler = async (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) => {
      console.error("Error Msg :", error.message);
    });
  };
};
