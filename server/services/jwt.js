'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Modules:
var jwt = require('jsonwebtoken');

// Models:
var Society = require('../models/society.model');
var CCA = require('../models/cca.model');

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
 * @param {string} [expires= '12h'] - Time to live for jwt.
 * @returns {string} Signed JWT.
 */
exports.signID = (id, type, expires = '12h') => {
  return jwt.sign({_id: id, type: type}, config.secretKey, {expiresIn: expires});
}

exports.signSubmission = (id, subId, type) => {
  return jwt.sign({_id: id, type: type, sub_id: subId}, config.secretKey);
}

exports.signFile = (fileId) => {
  return jwt.sign({_id: fileId}, config.secretKey);
}

exports.decodeTokenFunc = decodeToken;

/**
 * Verifies JWT token in bearer token authorization header.
 * @param req - Request.
 * @param res - Response.
 * @param next - Next.
 */
exports.verify = async (req, res, next) => {
  try {
    let token = req.get("Authorization");
    if (token) {
      token = token.substring(7);
    } else {
      // Raise "TokenError" here - missing token
      throw new customError.TokenError(400, "Missing token!", "no token in bearer token authorization header");
    }

    let decodedObj = decodeToken(token);
    if (decodedObj.err===undefined) {
      if (decodedObj.type==='soc' || decodedObj.type==='pat' || decodedObj.type==='pres') {
        let reqSociety = await Society.findById(decodedObj._id, 'active');
        if (reqSociety) {
          if (reqSociety.active) {
            req.body.userObj = {_id: decodedObj._id, type: decodedObj.type};
            if (decodedObj.sub_id) {
              req.body.userObj.sub_id = decodedObj.sub_id;
            }
            next();
          } else {
            // Raise user not active error
            throw new customError.ForbiddenAccessError("This account has been deactivated. Please contact a system admin to request activation.", "UserNotActiveError");
          }
        } else {
          // Raise "TokenError" - user not found
          throw new customError.TokenError(404, "Invalid token!", "user not found");
        }
      } else if (decodedObj.type==='cca') {
        let reqCCA = await CCA.findById(decodedObj._id, 'active');
        if (reqCCA) {
          if (reqCCA.active) {
            req.body.userObj = {_id: decodedObj._id, type: decodedObj.type};
            next();
          } else {
            // Raise user not active error
            throw new customError.ForbiddenAccessError("This account has been deactivated. Please contact a system admin to request activation.", "UserNotActiveError");
          }
        } else {
          // Raise "TokenError" - user not found
          throw new customError.TokenError(404, "Invalid token!", "User not found.");
        }
      } else {
        // Raise "TokenError" - invalid type
        throw new customError.TokenError(400, "Invalid token!", "Invalid user type.");
      }
    } else {
      // Raise "TokenError" here - based on jwt error
      throw new customError.TokenError(400, "Invalid token!", decodedObj.err.message, decodedObj.err.name);
    }
  } catch (err) {
    next(err);
  }
  
}