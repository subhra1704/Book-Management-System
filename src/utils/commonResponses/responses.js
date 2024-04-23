module.exports = {

  commonResponse: (res, statusCode, result, message) => {
    return res.json({
      result: result || null,
      response_message: message || null,
      response_code: statusCode,
    });
  },

  sendResponseWithPagination: (responseObj, responseCode, responseMessage, data, paginationData) => {
    return responseObj.send({ responseCode: responseCode, responseMessage: responseMessage, result: data, paginationData: paginationData || null, });
  },

  sendResponseWithData: (responseObj, responseCode, responseMessage, data, token) => {
    return responseObj.send({ response_code: responseCode, response_message: responseMessage, result: data, token: token, });
  },

  sendResponseWithoutData: (responseObj, responseCode, responseMessage) => {
    return responseObj.send({ response_code: responseCode, response_message: responseMessage });
  },
  
  sendResponeWithBlankArray: (responseObj, errorCode, result, errorMessage) => {
    return responseObj.send({ result: result || null, response_code: errorCode, response_message: errorMessage });
  },

};
