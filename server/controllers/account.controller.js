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
exports.createCCAAccount = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
    let existingCCA = await CCA.findOne({email: params.email}, 'ccaId');

    if (existingCCA) {
      // throw duplicate user error
    } else {
      let reqCCA = new CCA({firstName: params.firstName, lastName: params.lastName, email: params.email, password: params.password, picture: params.picture, permissions: params.permissions});
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
exports.createSocietyAccount = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
    let existingSociety = await Society.findOne({email: params.email});

    if (existingSociety){
      // throw duplicate error
    } else {
      let reqSociety = new Society({nameInitials: params.nameInitials, name: params.name, email: params.email, password: params.password, emailPresident: params.emailPresident, emailPatron: params.emailPatron});
      await reqSociety.save();

      res.json({status: 201, statusName: httpStatus.getName(201), message: "Account Creation Successful!", id: reqSociety.id});
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
exports.editCCAAccount = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
    let reqCCA = await CCA.findOneAndUpdate({ccaId: params.ccaId}, {firstName: params.firstName, lastName: params.lastName, email: params.email, password: params.password, picture: params.picture, permissions: params.permissions});

    if (reqCCA) {
      // success response
      res.json({
        statusCode: 203,
        statusName: httpStatus.getName(203),
        message: "Account Successfully Edited"
      });
    } else {
      // throw user not found error
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
exports.editSocietyAccount = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
    let reqSociety = await Society.findOneAndUpdate({societyId: params.socId}, {nameInitials: params.nameInitials, name: params.name, email: params.email, password: params.password, emailPresident: params.emailPresident, emailPatron: params.emailPatron});
  
    if (reqSociety){
      // success response
      res.json({
        statusCode: 203,
        statusName: httpStatus.getName(203),
        message: "Account Successfully Edited"
      });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * Deletes the existing account of a CCA member,
 * and throws an error if the user is not found.
 */
exports.deleteCCAAccount = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
    let reqCCA = await CCA.findOneAndDelete({ccaId: params.ccaId});

    if (reqCCA){
      // success response
      res.json({
        statusCode: 203,
        statusName: httpStatus.getName(203),
        message: "Account Successfully Deleted"
      });
    } else {
      // throw user not found error 
    }
  } catch (err) {
    next(err);
  } 
}

/**
* Deletes the existing account of a Society, 
* and throws an error if the user is not found. 
*/
exports.deleteSocietyAccount = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try{
    let reqSociety = await Society.findOneAndDelete({societyId: params.societyId});

    if (reqSociety) {
      // success response
      res.json({
        statusCode: 203,
        statusName: httpStatus.getName(203),
        message: "Account Successfully Deleted"
      });
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
exports.getCCAList = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try{
    let reqCCAList = await CCA.find({}, 'ccaId firstName lastName email picture permissions');
    
    if (reqCCAList.length) {
      let userList = [];

      for (let i = 0; i < reqCCAList.length; i++) {
        userList[i] = {};
        userList[i].ccaId = reqCCAList[i].ccaId;
        userList[i].firstName = reqCCAList[i].firstName;
        userList[i].lastName = reqCCAList[i].lastName;
        userList[i].email = reqCCAList[i].email;
        userList[i].picture = reqCCAList[i].picture;
        userList[i].permissions = reqCCAList[i].permissions; 
      }

      // success response
      res.json({
        statusCode: 200,
        statusName: httpStatus.getName(200),
        message: " CCA Account List Retrieved",
        userList: userList
      });
    } else {
      // throw users not found error
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
exports.getSocietyList = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try{
    let reqSocietyList = await Society.find({}, 'socId nameInitials nameSociety emailSociety');
    if (reqSocietyList.length)
    {
      let userList = [];

      for (let i = 0; i<reqSocietyList.length; i++){
        userList[i] = {};
        userList[i].socId = reqSociety[i].socId;
        userList[i].nameInitials = reqSociety[i].nameInitials;
        userList[i].nameSociety = reqSociety[i].nameSociety;
        userList[i].emailSociety = reqSociety[i].emailSociety;
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
    }
  } catch (err){
    next(err);
  }
}

/**
 * Changes the password of a CCA
 * account.
 */
exports.changeCCAPassword = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
    let reqCCA = await CCA.findById(params.userObj._id, 'password');

    if(reqCCA.password == params.passwordCurrent) {
      await CCA.findByIdAndUpdate(params.userObj._id, {password: params.passwordNew}, 'ccaId');

      // success response
      res.json({
        statusCode: 203,
        statusName: httpStatus.getName(203),
        message: "Password Successfully Changed"
      });
    } else {
      // throw bad request error - invalid password
    }

  } catch (err) {
    next(err);
  }
}

/**
 * Changes the password of a Society
 * account.
 */
exports.changeSocietyPassword = async (req, res, next) => {
  //Variables:
  let params = req.body;

  try{
    let reqSociety = await Society.findById(params.userObj._id, 'password');

    if(reqSociety.password == params.passwordCurrent) {
      await Society.findByIdAndUpdate(params.userObj._id, {password: params.passwordNew}, 'socId');

      // success response
      res.json({
        statusCode: 203,
        statusName: httpStatus.getName(203),
        message: "Password Successfully Changed"
      });
    } else {
      // throw bad request error - invalid passwod
    }
  } catch (err) {
    next(err);
  }
}

