'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Models:
var Society = require('../models/society.model');
var CCA = require('../models/')

// Services:
var jwt = require('../services/jwt');
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
* Logins the cca if correct combination of "email" and password
* is supplied in req.body object. Sends a response back with a jwt
* token and user object containing user data.
*/
exports.ccaLogin = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
    let reqCCA = await CCA.findOne({email: params.email, passowrd: params.password}, '_id id firstName lastName picture permissions');
    if (reqCCA) {
      let token = jwt.signID(reqCCA._id, "cca", "12h");
      res.json({
        statusCode: 200,
        statusName: httpStatus.getName(200),
        message: "Login successful!",
        token: token,
        user: {
          id: reqCCA.id,
          firstName: reqCCA.firstName,
          lastName: reqCCA.lastName,
          picture: reqCCA.picture,
          permissions: reqCCA.permissions
        }
      });
    } else {
      throw new customError.AuthenticationError;
    }
  } catch(err) {
    next(err);
  }
}

/**
 * Logins the society if correct combination of "email" and password
 * is supplied in req.body object. Sends a response back with a jwt
 * token and user object containing user data.
 */
exports.societyLogin = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
    let reqSociety = await Society.findOne({email: params.email, password: params.password}, '_id id name nameInitials presidentEmail patronEmail');
    if (reqSociety) {
      let token = jwt.signID(reqSociety._id, "soc", "12h");
      res.json({
        statusCode: 200,
        statusName: httpStatus.getName(200),
        message: "Login successful!",
        token: token,
        user: {
          id: reqSociety.id,
          name: reqSociety.name,
          nameInitials: reqSociety.nameInitials,
          patronEmail: reqSociety.patronEmail,
          presidentEmail: reqSociety.presidentEmail
        }
      });
    } else {
      throw new customError.AuthenticationError;
    }
  } catch(err) {
    next(err);
  }
}