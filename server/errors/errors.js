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
   * @param {string} err - Status name of error.
   * @param {string} details - Details of error.
   * @param {string} [type= undefined] - JsonWebToken module's error class.
   */
  constructor(status, msg, err, details, type = undefined) {
    this.name = "TokenError";
    this.statusCode = status;
    this.message = msg;
    this.error = err;
    this.errorDetails = details;
    if (!type) {
      this.errType = type;
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
  */
  constructor() {
    this.name = "AuthenticationError";
    this.statusCode = 401;
    this.message = "Authentication unsuccessful!";
    this.error = "Unauthroized";
    this.errorDetails = "invalid username or password";
    this.errType = "CustomError";
  }
}

// Export Classes:
module.exports.TokenError = TokenError;
module.exports.AuthenticationError = AuthenticationError;