'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Others:
var router = require('express').Router();
var validate = require('express-validation').validate;
var jwt = require('../services/jwt');
var formValidation = require('../validations/form.validation');
var formController = require('../controllers/form.controller');
var { validateUserAccess, validateCCAAccess } = require('../services/access-validator');

/*
  ------------------ CODE BODY --------------------
*/

// API 3.1: Create Form
router.post(
  '/create',
  validate(formValidation.createFormValidation, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  formController.createForm
);

// API 3.2: Edit Form
router.post(
  '/edit',
  validate(formValidation.editFormValidation, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  formController.editForm
);

// API 3.3: Delete Form
router.post(
  '/delete',
  // validate(formValidation.editFormValidation, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  formController.deleteForm
);

// API 3.4: Fetch Form
router.post(
  '/fetch',
  validate(formValidation.fetchFormValidation, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  // validateCCAAccess,
  formController.fetchForm
);

// API 3.5: Fetch Form
router.post(
  '/fetch-list',
  jwt.verify,
  validateUserAccess,
  // validateCCAAccess,
  formController.fetchFormList
);

// Export router
module.exports = router;