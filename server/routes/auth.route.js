'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Others:
var router = require('express').Router();
var validate = require('express-validation').validate;
var authValidation = require('../validations/auth.validation');
var verify = require('../services/jwt').verify;
var authController = require('../controlles/auth.controller');

/*
  ------------------ CODE BODY --------------------
*/

// API 1.2: Society Login:
router.post(
  '/society-login', 
  verify, 
  validate(authValidation.societyLoginValidation, {keyByField: true}),
  authController.societyLogin
);

// Export router
module.exports = router;