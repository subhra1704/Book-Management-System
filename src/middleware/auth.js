const catchAsync = require("../utils/errorHandlers/catchAsync");
const appError = require("../utils/errorHandlers/errorHandler");
const { ErrorMessage } = require("../utils/commonMessages/message");
const { ErrorCode } = require("../utils/commonStatusCode/statusCode");
const { verifyTokens } = require("../utils/helper");
const userRole = require("../utils/enum/user");
const config=require("../config/config.json")

module.exports = {
  authorize: catchAsync(async (req, res, next) => {
    const authorizationHeader = req.header("Authorization");
    if (!authorizationHeader) {
      throw new appError(ErrorMessage.NO_AUTH_TOKEN, ErrorCode.UNAUTHORIZED);
    }
    const token = authorizationHeader.split(" ")[1];
    if (!token)
      throw new appError(ErrorMessage.NO_AUTH_TOKEN, ErrorCode.UNAUTHORIZED);

    const data = verifyTokens(token, config.ACCESS_JWT_KEY);
    if (data.role !== userRole.USER)
      throw new appError(
        ErrorMessage.USER_NOT_AUTHORIZED,
        ErrorCode.UNAUTHORIZED
      );

    req.user = data;
    next();
  }),


  validateOTP: catchAsync((req, res, next) => {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader) {
      throw new appError(ErrorMessage.NO_AUTH_TOKEN, ErrorCode.UNAUTHORIZED);
    }
    const token = authorizationHeader.split(" ")[1];
    if (!token)
      throw new appError(ErrorMessage.NO_AUTH_TOKEN, ErrorCode.UNAUTHORIZED);

    const data = verifyTokens(token, config.ACCESS_JWT_KEY);
    if (data.role !== "OTP")
      throw new appError(
        ErrorMessage.USER_NOT_AUTHORIZED,
        ErrorCode.UNAUTHORIZED
      );

    req.user = data;
    next();
  }),
};
