const { ErrorCode } = require("../commonStatusCode/statusCode");
const { ErrorMessage } = require("../commonMessages/message");

module.exports = (err, req, res, next) => {

  const customErrors = {
    'jwt expired': { statusCode: ErrorCode.UNAUTHORIZED, message: ErrorMessage.TOKEN_EXPIRED },
    'jwt malformed': { statusCode: ErrorCode.BAD_REQUEST, message: ErrorMessage.INVALID_JWT_TOKEN },
    'invalid signature': { statusCode: ErrorCode.BAD_REQUEST, message: ErrorMessage.INVALID_SIGNATURE },
  }

  const statusCode = customErrors[err?.message]?.statusCode || err?.statusCode || ErrorCode?.INTERNAL_ERROR;
  const errMessage = customErrors[err?.message]?.message || err?.message || ErrorMessage?.INTERNAL_SERVER_ERROR;
  console.log(`${statusCode} - ${err.message} - ${req.path} ${req.method}`);
    res.status(statusCode).json({
      success: false,
      message: errMessage,
      statusCode: statusCode,
      reference: `${req.path} ${req.method}`,
      stack: err.stack,
    });

};