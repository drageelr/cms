'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Modules:
var ValidationError = require('express-validation').ValidationError;

// Services:
var httpStatus = require('../services/http-status');

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
      statusCode: 400,
      statusName: httpStatus.getName(400),
      message: "Request object validation failed!",
      error: {
        name: "ValidationError",
        subName: "N/A",
        details: err.details
      }
    });
  } else if (err instanceof customError.TokenError || err instanceof customError.AuthenticationError || err instanceof customError.ForbiddenAccessError) {
    res.json({
      statusCode: err.statusCode,
      statusName: httpStatus.getName(err.statusCode),
      message: err.message,
      error: {
        name: err.name,
        subName: err.subName,
        details: err.details
      }
    })
  } else {
    res.json({statusCode: 500, statusName: httpStatus.getName(500), message: "Something went wrong on the server end!"});
  }
}