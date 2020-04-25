'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Others:
var router = require('express').Router();
var validate = require('express-validation').validate;
var jwt = require('../services/jwt');
var accountValidation = require('../validations/account.validation');
var accountController = require('../controllers/account.controller');
var { validateUserAccess, validateCCAAccess } = require('../services/access-validator');

/*
  ------------------ CODE BODY --------------------
*/

// API 2.1: Create CCA Account
router.post(
  '/cca/create-account',
  validate(accountValidation.ccaCreateAccount, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  accountController.createCCAAccount
);

// API 2.2: Create Society Account
router.post(
  '/society/create-account',
  validate(accountValidation.societyCreateAccount, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  accountController.createSocietyAccount
);

// API 2.3: Edit CCA Account
router.post(
  '/cca/edit-account',
  validate(accountValidation.ccaEditAccount, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  accountController.editCCAAccount
);

// API 2.4: Edit Society Account
router.post(
  '/society/edit-account',
  validate(accountValidation.societyEditAccount, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  accountController.editSocietyAccount
);

// API 2.5: Get CCA Account List
router.post(
  '/cca/account-list',
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  accountController.getCCAList
);

// API 2.6: Get Society Account List
router.post(
  '/society/account-list',
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  accountController.getSocietyList
);

// API 2.7: Change Password (CCA)
router.post(
  '/cca/change-password',
  validate(accountValidation.changePassword, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  accountController.changeCCAPassword
);

// API 2.8: Change Password (Society)
router.post(
  '/society/change-pasword',
  validate(accountValidation.changePassword, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  accountController.changeSocietyPassword
);

// API 2.9: Change Picture (CCA)
router.post(
  '/cca/change-picture',
  validate(accountValidation.changeCCAPicture, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  accountController.changeCCAPicture
);

// Export router
module.exports = router;