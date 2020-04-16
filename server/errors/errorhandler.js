'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Modules:
var ValidationError = require('express-validation').ValidationError;

// Others:
var customError = require('../errors/errors');

/*
  ------------------ CODE BODY --------------------
*/

/*
  <<<<< EXPORT FUNCTIONS >>>>>
*/

/**
 * Custom error handler.
 */
exports.errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.json({
      status: 400,
      message: "Request object validation failed!",
      error: {
        name: "ValidationError",
        error: "Bad Request",
        details: err.details
      }
    });
  } else if (err instanceof customError.TokenError || err instanceof customError.AuthenticationError) {
    res.json({
      status: err.statusCode,
      message: err.message,
      error: {
        name: err.name,
        error: err.error,
        details: err.errorDetails,
        type: err.errType
      }
    })
  } else {
    res.json({status: 500, message: "Internal Server Error!"});
  }
}