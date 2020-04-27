'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Modules:
var jwt = require('jsonwebtoken');

/*
  ------------------ CODE BODY --------------------
*/

/*
  <<<<< EXPORT CLASSES >>>>>
*/

// Token Error Class:
class TokenError extends Error {

  /**
   * Creates a TokenError object.
   * @param {number} status - Status Code.
   * @param {string} msg - Message to send to client as a response.
   * @param {string} errDetails - Details of error.
   * @param {string} [sName= undefined] - JsonWebToken module's error class.
   */
  constructor(status, msg, errDetails, sName = undefined) {
    super();
    this.name = "TokenError";
    this.statusCode = status;
    this.message = msg;
    this.details = errDetails;
    this.subName = "N/A";
    if (!sName) {
      this.subName = sName;
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TokenError);
    }
  }
}

// Authentication Error Class:
class AuthenticationError extends Error {

  /**
  * Creates an AuthenticationError object.
  * @param {string} errDetails - Details of the error.
  */
  constructor(errDetails) {
    super();
    this.name = "AuthenticationError";
    this.statusCode = 401;
    this.message = "Invalid credentials!";
    this.details = errDetails;
    this.subName = "N/A";
  }
}

// Forbidden Access Error Class:
class ForbiddenAccessError extends Error {

  /**
  * Creates an ForbiddenAccessError object.
  * @param {string} errDetails - Details of the error.
  * @param {string} errSubName - Sub name of the error. "RouteError", "PermissionError", "UserNotActiveError"
  */
  constructor(errDetails, errSubName) {
    super();
    this.name = "ForbiddenAccessError";
    this.statusCode = 403;
    this.message = "You don't have the necessary permissions for this resource!";
    this.details = errDetails;
    this.subName = "N/A";
  }
}

// Duplicate User Error Class:
class DuplicateUserError extends Error {

  /**
  * Creates a DuplicateUserError object.
  */
  constructor(errDetails) {
    super();
    this.name = "DuplicateUserError";
    this.statusCode = 400;
    this.message = "User already exists!";
    this.details = errDetails;
    this.subName = "N/A";
  }
}

// User Not Found Error Class:
class UserNotFoundError extends Error {

  /**
  * Creates a UserNotFoundError object.
  */
  constructor(errDetails) {
    super();
    this.name = "UserNotFoundError";
    this.statusCode = 404;
    this.message = "User not found!";
    this.details = errDetails;
    this.subName = "N/A";
  }
}

// Form Validation Error Class:
class FormValidationError extends Error {

  /**
  * Creates a FormValidationError object.
  */
  constructor(errDetails) {
    super();
    this.name = "FormValidationError";
    this.statusCode = 400;
    this.message = "Form not valid!";
    this.details = errDetails;
    this.subName = "N/A";
  }
}

// Form Not Found Error Class:
class FormNotFoundError extends Error {

  /**
  * Creates a FormNotFoundError object.
  */
  constructor(errDetails) {
    super();
    this.name = "FormNotFoundError";
    this.statusCode = 404;
    this.message = "Form not found!";
    this.details = errDetails;
    this.subName = "N/A";
  }
}

// Submission Validation Error Class:
class SubmissionValidationError extends Error {

  /**
  * Creates a SubmissionValidationError object.
  */
  constructor(errDetails) {
    super();
    this.name = "SubmissionValidationError";
    this.statusCode = 400;
    this.message = "Submission not valid!";
    this.details = errDetails;
    this.subName = "N/A";
  }
}

// Submission Not Found Error Class:
class SubmissionNotFoundError extends Error {

  /**
  * Creates a SubmissionNotFoundError object.
  */
  constructor(errDetails) {
    super();
    this.name = "SubmissionNotFoundError";
    this.statusCode = 404;
    this.message = "Submission not found!";
    this.details = errDetails;
    this.subName = "N/A";
  }
}

// Export Classes:
module.exports.TokenError = TokenError;
module.exports.AuthenticationError = AuthenticationError;
module.exports.ForbiddenAccessError = ForbiddenAccessError;
module.exports.DuplicateUserError = DuplicateUserError;
module.exports.UserNotFoundError = UserNotFoundError;
module.exports.FormValidationError = FormValidationError;
module.exports.FormNotFoundError = FormNotFoundError;
module.exports.SubmissionValidationError = SubmissionValidationError;
module.exports.SubmissionNotFoundError = SubmissionNotFoundError;