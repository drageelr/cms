'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Others:
var router = require('express').Router();
var validate = require('express-validation').validate;
var authValidation = require('../validations/auth.validation');
var authController = require('../controllers/auth.controller');

/*
  ------------------ CODE BODY --------------------
*/

// API 1.1: CCA Login:
router.post(
  '/cca/login',
  validate(authValidation.loginValidation, {keyByField: true}),
  authController.ccaLogin
);

// API 1.2: Society Login:
router.post(
  '/society/login', 
  validate(authValidation.loginValidation, {keyByField: true}),
  authController.societyLogin
);

// Export router
module.exports = router;