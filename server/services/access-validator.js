'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

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
  "/api/form/fetch": ["cca", "soc"],
  "/api/form/create": ["cca"],
  "/api/form/edit": ["cca"],
  "/api/form/delete": ["cca"],
  "/api/form/fetch-list": ["cca", "soc"],
  
  // 4. Request Management API "submission.route.js":
  "/api/form-submission/submit": ["soc"],
  "/api/form-submission/edit": ["soc"],
  "/api/form-submission/view": ["cca", "soc", "pres", "pat"],
  "/api/form-submission/add-note-society": ["soc"],
  "/api/form-submission/cca-list": ["cca"],
  "/api/form-submission/society-list": ["soc"],
  "/api/form-submission/update-status-cca": ["cca"],
  "/api/form-submission/add-note-cca": ["cca"],
  "/api/form-submission/update-status-pp": ["pres", "pat"],  
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
  "/api/form-submission/update-status-cca": "setFormStatus",
  "/api/form-submission/add-note-cca": "addCCANote", 
};

/*
  <<<<< EXPORT FUNCTIONS >>>>>
*/

exports.validateUserAccess = (req, res, next) => {
  let accessList = userAccess[req.originalUrl];
  if (accessList) {
    let accessGranted = false;
    
    for (let a of accessList) {
      if (a == req.body.userObj.type) {
        accessGranted = true;
        break;
      }
    }

    if (req.originalUrl == "/api/form-submission/view" && (req.body.userObj.type == "pres" || req.body.userObj.type == "pat")) {
      // To do..
    }

    if (accessGranted) {
      next();
    } else {
      throw new customError.ForbiddenAccessError("forbidden access to resource", "RouteError");
    }
  }
}

exports.validateCCAAccess = async (req, res, next) => {
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
}