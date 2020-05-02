'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Models:
var CCA = require('../models/cca.model');

// Services:
var httpStatus = require('../services/http-status');

// Others:
var config = require('../config/config').variables;
var customError = require('../errors/errors');

/*
  ------------------ CODE BODY --------------------
*/

// Constants:
const userAccess = {
  // 2. User Management API "account.route.js":
  "/api/account/cca/create-account": ["cca"],
  "/api/account/society/create-account": ["cca"],
  "/api/account/cca/edit-account": ["cca"],
  "/api/account/society/edit-account": ["cca"],
  "/api/account/cca/account-list": ["cca"],
  "/api/account/society/account-list": ["cca"],
  "/api/account/cca/change-password": ["cca"],
  "/api/account/society/change-password": ["soc"],
  "/api/account/cca/change-picture": ["cca"],

  // 3. Form Management API "form.route.js":
  "/api/form/create": ["cca"],
  "/api/form/edit": ["cca"],
  "/api/form/delete": ["cca"],
  "/api/form/fetch": ["cca", "soc"],
  "/api/form/fetch-list": ["cca", "soc"],
  
  // 4. Request Management API "submission.route.js":
  "/api/submission/submit": ["soc"],
  "/api/submission/cca/add-note": ["cca"],
  "/api/submission/society/add-note": ["soc"],
  "/api/submission/fetch-list": ["cca", "soc"],
  "/api/submission/cca/update-status": ["cca", "pres", "pat"],
  "/api/submission/cca/fetch": ["cca", "soc", "pres", "pat"],
};

const ccaAccess = {
  // 2. User Management API "account.route.js":
  "/api/account/cca/create-account": "ccaCRUD",
  "/api/account/society/create-account": "societyCRUD",
  "/api/account/cca/edit-account": "ccaCRUD",
  "/api/account/society/edit-account": "societyCRUD",
  "/api/account/cca/account-list": "ccaCRUD",
  "/api/account/society/account-list": "societyCRUD",
  
  // 3. Form Management API "form.route.js":
  "/api/form/create": "accessFormMaker",
  "/api/form/edit": "accessFormMaker",
  "/api/form/delete": "accessFormMaker",

  // 4. Request Management API "submission.route.js":
  "/api/submission/cca/add-note": "addCCANote",
  "/api/submission/cca/update-status": "setFormStatus",
};

/*
  <<<<< EXPORT FUNCTIONS >>>>>
*/

exports.validateUserAccess = (req, res, next) => {
  try {
    let accessList = userAccess[req.originalUrl];
    if (accessList) {
      let accessGranted = false;
    
      for (let a of accessList) {
        if (a == req.body.userObj.type) {
          accessGranted = true;
          break;
        }
      }

      if (accessGranted) {
        next();
      } else {
        throw new customError.ForbiddenAccessError("forbidden access to resource", "RouteError");
      }
    } else {
      next(err);
    }
  } catch (err) {
    next(err)
  }
}

exports.validateCCAAccess = async (req, res, next) => {
  try {
    if (req.body.userObj.type == "cca") {
      let reqCCA = await CCA.findById(req.body.userObj._id, 'role permissions');
      if (reqCCA.role != "admin") {
        let access = ccaAccess[req.originalUrl];
        if(reqCCA.permissions[access]) {
          next();
        } else {
          throw new customError.ForbiddenAccessError("cca user does not have valid permission for this resource", "PermissionError");
        }
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}