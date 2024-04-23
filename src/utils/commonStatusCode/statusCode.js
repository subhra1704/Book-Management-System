module.exports.ErrorCode = Object.freeze({
    'BAD_REQUEST': 400,
    'UNAUTHORIZED': 401,
    'INTERNAL_ERROR': 500,
    'SOMETHING_WRONG': 501,
    'INVALID_CREDENTIAL': 402,
    'FORBIDDEN': 403,
    'NOT_FOUND': 404,
    'VALIDATION_FAILED': 422,
    'ALREADY_EXIST': 409,
    'NOT_ALLOWED': 405,
    'NO_LONGER_EXIST': 410,
    'NOT_ACCEPTABLE' : 406,
    'RATE_LIMIT_EXCEEDED': 429
});

module.exports.SuccessCode = Object.freeze({
    'SUCCESS': 200,
    'CREATED': 201,
    'UPDATED': 202,
    'NO_CONTENT': 204
});