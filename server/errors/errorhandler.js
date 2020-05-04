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
  } else if (err instanceof customError.TokenError ||
    err instanceof customError.AuthenticationError ||
    err instanceof customError.ForbiddenAccessError ||
    err instanceof customError.DuplicateUserError ||
    err instanceof customError.UserNotFoundError ||
    err instanceof customError.FormValidationError ||
    err instanceof customError.FormNotFoundError ||
    err instanceof customError.SubmissionValidationError ||
    err instanceof customError.SubmissionNotFoundError ||
    err instanceof customError.TaskStatusNotFoundError ||
    err instanceof customError.ChecklistNotFoundError ||
    err instanceof customError.TaskNotFoundError ||
    err instanceof customError.SubTaskNotFoundError) {
    console.log(err.stack)
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
    console.log(err);
    res.json({statusCode: 500, statusName: httpStatus.getName(500), message: "Something went wrong on the server end!"});
  }
}