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
const access = {
  // 2. User Management API "account.route.js":
  "/api/account/cca/create-account": ["cca"],
  "/api/account/cca/edit-account": ["cca"],
  "/api/account/cca/delete-account": ["cca"],
  "/api/account/society/create-account": ["cca"],
  "/api/account/society/edit-account": ["cca"],
  "/api/account/society/delete-account": ["cca"],
  "/api/account/society/change-password": ["soc"],

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

/*
  <<<<< EXPORT FUNCTIONS >>>>>
*/

exports.validateAccess = (req, res, next) => {
  let accessList = access[req.originalUrl];
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
      throw new customError.ForbiddenAccessError("forbidden access to resource");
    }
  }
}