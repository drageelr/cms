'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Models:
var Society = require('../models/society.model');
var CCA = require('../models/cca.model')

// Services:
var jwt = require('../services/jwt');
var httpStatus = require('../services/http-status');

// Others:
var customError = require('../errors/errors');
var helperFuncs = require('../services/helper-funcs');

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
// API 1.1 Controller
exports.ccaLogin = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
    let reqCCA = await CCA.findOne({email: params.email, password: params.password}, '_id ccaId firstName lastName picture permissions');
    if (reqCCA) {
      let token = jwt.signID(reqCCA._id, "cca", "12h");

      let permissions = helperFuncs.duplicateObject(reqCCA.permissions, ["societyCRUD", "ccaCRUD", "accessFormMaker", "createReqTask", "createCustomTask", "createTaskStatus", "archiveTask", "unarchiveTask", "setFormStatus", "addCCANote"]);
      
      res.json({
        statusCode: 200,
        statusName: httpStatus.getName(200),
        message: "Login successful!",
        token: token,
        user: {
          id: reqCCA.ccaId,
          firstName: reqCCA.firstName,
          lastName: reqCCA.lastName,
          picture: reqCCA.picture,
          permissions: permissions
        }
      });
    } else {
      throw new customError.AuthenticationError("invalid email or password");
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
// API 1.2 Controller
exports.societyLogin = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
    let reqSociety = await Society.findOne({email: params.email, password: params.password}, '_id societyId name nameInitials presidentEmail patronEmail');
    if (reqSociety) {
      let token = jwt.signID(reqSociety._id, "soc", "12h");
      res.json({
        statusCode: 200,
        statusName: httpStatus.getName(200),
        message: "Login successful!",
        token: token,
        user: {
          id: reqSociety.societyId,
          name: reqSociety.name,
          nameInitials: reqSociety.nameInitials,
          patronEmail: reqSociety.patronEmail,
          presidentEmail: reqSociety.presidentEmail
        }
      });
    } else {
      throw new customError.AuthenticationError("invalid email or password");
    }
  } catch(err) {
    next(err);
  }
}