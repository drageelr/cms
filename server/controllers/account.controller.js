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
 * Creates a new CCA member account if all required fields 
 * are provided. In case an account with the same email address
 * already exists, it will not be created. 
 */
// API 2.1 Controller
exports.createCCAAccount = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
    let existingCCA = await CCA.findOne({email: params.email}, 'ccaId');

    if (existingCCA) {
      // throw duplicate user error
      throw new customError.DuplicateUserError("The email address is already associated to another CCA account.");
    } else {
      let reqCCA = new CCA({firstName: params.firstName, lastName: params.lastName, email: params.email, password: params.password, picture: params.picture, permissions: params.permissions, active: true, role: params.role, themeColor: "#3578fa", darkMode: false});
      await reqCCA.save();

      res.json({
        statusCode: 201, 
        statusName: httpStatus.getName(201), 
        message: "Account Successfully Created", 
        ccaId: reqCCA.ccaId
      });
    }
  } catch (err) {
    next(err);
  }
}

/**
* Creates a new Society Account if all required fields
* are provided. In case an account with the same email 
* address already exists, it will not be created. 
*/
// API 2.2 Controller
exports.createSocietyAccount = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
    let existingSociety = await Society.findOne({email: params.email});

    if (existingSociety){
      // throw duplicate error
      throw new customError.DuplicateUserError("The email address is already associated to another Society account.");
    } else {
      let reqSociety = new Society({nameInitials: params.nameInitials, name: params.name, email: params.email, password: params.password, presidentEmail: params.presidentEmail, patronEmail: params.patronEmail, active: true, themeColor: "#3578fa", darkMode: false});
      await reqSociety.save();

      res.json({
        statusCode: 201,
        statusName: httpStatus.getName(201),
        message: "Account Creation Successful",
        societyId: reqSociety.societyId
      });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * Edits details of an existing account of a 
 * CCA member, and throws an error if the user 
 * is not found.
 */
// API 2.3 Controller
exports.editCCAAccount = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
    let ccaObject = helperFuncs.duplicateObject(params, ["email", "password", "role", "firstName", "lastName", "picture", "active", "themeColor", "darkMode"], true);
    if (params.permissions) {
      let reqPermissions = helperFuncs.duplicateObject(params.permissions, [], true, "permissions.");
      ccaObject.$set = reqPermissions;
    }

    let reqCCA = await CCA.findOneAndUpdate({ccaId: params.ccaId}, ccaObject);

    if (reqCCA) {
      // success response
      res.json({
        statusCode: 203,
        statusName: httpStatus.getName(203),
        message: "Account Successfully Edited"
      });
    } else {
      // throw user not found error
      throw new customError.UserNotFoundError("CCA user not found.");
    }
  } catch (err) {
    next(err);
  }
}

/**
* Edits details of an existing account of a 
* Society, and throws an error if the user
* is not found.
*/
// API 2.4 Controller
exports.editSocietyAccount = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
    let societyObject = helperFuncs.duplicateObject(params, ["email", "password", "name", "nameInitials", "presidentEmail", "patronEmail", "active",  "themeColor", "darkMode"], true);

    let reqSociety = await Society.findOneAndUpdate({societyId: params.societyId}, societyObject);
  
    if (reqSociety){
      // success response
      res.json({
        statusCode: 203,
        statusName: httpStatus.getName(203),
        message: "Account Successfully Edited"
      });
    } else {
      // throw user not found error
      throw new customError.UserNotFoundError("Society account not found.");
    }
  } catch (err) {
    next(err);
  }
}

/**
 * Fetches details of all CCA member 
 * accounts, throws an error if member
 * is not found.
 */
// API 2.5 Controller
exports.getCCAList = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try{
    let reqCCAList = await CCA.find({}, '-_id -password');
    
    if (reqCCAList.length) {
      let userList = [];

      for (let i = 0; i < reqCCAList.length; i++) {
        userList[i] = helperFuncs.duplicateObject(reqCCAList[i], ["ccaId", "email", "role", "firstName", "lastName", "picture", "active"]);
        userList[i].permissions = helperFuncs.duplicateObject(reqCCAList[i].permissions, ["societyCRUD", "ccaCRUD", "accessFormMaker", "createReqTask", "createCustomTask", "createTaskStatus", "archiveTask", "unarchiveTask", "setFormStatus", "addCCANote"]);
      }

      // success response
      res.json({
        statusCode: 200,
        statusName: httpStatus.getName(200),
        message: "CCA Account List Retrieved",
        userList: userList
      });
    } else {
      // throw users not found error
      // throw new customError.UserNotFoundError("No CCA accounts exist.");
    }
  } catch (err) {
    next(err);
  }
}

/**
 * Fetches details of all Society 
 * Accounts, throws an error if a
 * society is not found.
 */
// API 2.6 Controller
exports.getSocietyList = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try{
    let reqSocietyList = await Society.find({}, '-_id -password');
    
    if (reqSocietyList.length) {
      let userList = [];

      for (let i = 0; i < reqSocietyList.length; i++) {
        userList[i] = helperFuncs.duplicateObject(reqSocietyList[i], ["societyId", "email", "name", "nameInitials", "presidentEmail", "patronEmail", "active"]);
      }

      // success response
      res.json({
        statusCode: 200,
        statusName: httpStatus.getName(200),
        message: "Society Account List Retrieved",
        userList: userList
      });
    } else {
      // throw user not found error
      // throw new customError.UserNotFoundError("No Society accounts exist.");
    }
  } catch (err){
    next(err);
  }
}

/**
 * Changes the password of a CCA
 * account.
 */
// API 2.7 Controller
exports.changeCCAPassword = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
    let reqCCA = await CCA.findById(params.userObj._id, 'password');

    if(reqCCA.password===params.passwordCurrent) {
      await CCA.findByIdAndUpdate(params.userObj._id, {password: params.passwordNew});

      // success response
      res.json({
        statusCode: 203,
        statusName: httpStatus.getName(203),
        message: "Password Successfully Changed"
      });
    } else {
      // throw bad request error - invalid password
      throw new customError.AuthenticationError("Your previous password does not match.");
    }

  } catch (err) {
    next(err);
  }
}

/**
 * Changes the password of a Society
 * account.
 */
// API 2.8 Controller
exports.changeSocietyPassword = async (req, res, next) => {
  //Variables:
  let params = req.body;

  try{
    let reqSociety = await Society.findById(params.userObj._id, 'password');

    if(reqSociety.password===params.passwordCurrent) {
      await Society.findByIdAndUpdate(params.userObj._id, {password: params.passwordNew});

      // success response
      res.json({
        statusCode: 203,
        statusName: httpStatus.getName(203),
        message: "Password Successfully Changed"
      });
    } else {
      // throw bad request error - invalid password
      throw new customError.AuthenticationError("Your previous password does not match.");
    }
  } catch (err) {
    next(err);
  }
}

/**
* Changes the picture of a CCA
* account.
*/
// API 2.9 Controller
exports.changeCCAPicture = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
      await CCA.findByIdAndUpdate(params.userObj._id, {picture: params.picture});

      // success response
      res.json({
        statusCode: 203,
        statusName: httpStatus.getName(203),
        message: "Picture changed successfully"
      });
  } catch (err) {
    next(err);
  }
}

// API 2.10 Controller
exports.changeSocietyTheme = async (req, res, next) => {
  //Variables:
  let params = req.body;

  try {
    let societyObject = helperFuncs.duplicateObject(params, ["themeColor", "darkMode"], true);

    await Society.findByIdAndUpdate(params.userObj._id, societyObject);
    
    // success response
    res.json({
      statusCode: 203,
      statusName: httpStatus.getName(203),
      message: "Theme Successfully Changed"
    });
  } catch (err) {
    next(err);
  }
}