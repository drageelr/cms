'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Modules:
var jwt = require('jsonwebtoken');

// Models:
var Society = require('../models/society.model');

// Services:
var httpStatus = require('../services/http-status');

// Others:
var config = require('../config/config').variables;
var customError = require('../errors/errors');

/*
  ------------------ CODE BODY --------------------
*/

/*
  <<<<< HELPER FUNCTIONS >>>>>
*/

/**
 * Decodes JSON Web Token.
 * @param {string} token - Token to decode.
 * @returns {object} - Decoded object or error object.
 */
function decodeToken(token) {
  try {
    let decodedObj = jwt.verify(token, config.secretKey);
    return decodedObj;
  } catch (err) {
    return {err: err}
  }
}

/*
  <<<<< EXPORT FUNCTIONS >>>>>
*/

/**
 * Creates a JWT based on the given ID.
 * @param id - ID to encode.
 * @param {string} type - Type of user (Society - 'soc', CCA - 'cca', Patron - 'pat', President - 'pres').
 * @param {string} [expiresIn= '12h'] - Time to live for jwt.
 * @returns {string} Signed JWT.
 */
exports.signID = (id, type ,expiresIn = '12h') => {
  return jwt.sign({_id: id, type: type}, config.secretKey, expiresIn);
}

/**
 * Verifies JWT token in bearer token authorization header.
 * @param req - Request.
 * @param res - Response.
 * @param next - Next.
 */
exports.verify = async (req, res, next) => {
  let token = req.header.authorization;
  if (token) {
    token = token.subString(7);
  } else {
    // Raise "TokenError" here - missing token
    throw new customError.TokenError(400, "Missing token!", "no token in bearer token authorization header");
  }

  let decodedObj = decodeToken(token);
  if (decodedObj.err == undefined) {
    if (decodedObj.type == 'soc' || decodedObj.type == 'pat', decodedObj.type == 'pres') {
      let reqSociety = await Society.findById(decodedObj._id, 'id');
      if (reqSociety) {
        req.body.userObj = {_id: decodedObj._id, type: decodedObj.type};
        next();
      } else {
        // Raise "TokenError" - user not found
        throw new customError.TokenError(404, "Invalid token!", "user not found");
      }
    } else if (decodedObj.type == 'cca') {
      // To do..
    } else {
      // Raise "TokenError" - invalid type
      throw new customError.TokenError(400, "Invalid token!", "invalid user type");
    }
  } else {
    // Raise "TokenError" here - based on jwt error
    throw new customError.TokenError(400, "Invalid token!", decodedObj.err.message, decodedObj.err.name);
  }
}