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
  */
  constructor() {
    this.name = "AuthenticationError";
    this.statusCode = 401;
    this.message = "Invalid credentials!";
    this.details = "invalid username or password";
    this.subName = "N/A";
  }
}

// Export Classes:
module.exports.TokenError = TokenError;
module.exports.AuthenticationError = AuthenticationError;