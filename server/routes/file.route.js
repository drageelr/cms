'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Others:
var router = require('express').Router();
var validate = require('express-validation').validate;
var jwt = require('../services/jwt');
var fileValidation = require('../validations/file.validation');
var  fileController = require('../controllers/file.controller');
var { validateUserAccess, validateCCAAccess } = require('../services/access-validator');

/*
  ------------------ CODE BODY --------------------
*/

// API 6.1: Upload File:
router.post(
  '/upload',
  jwt.verify,
  validateUserAccess,
  fileController.uploadFile
);

// API 6.2: Upload File:
router.post(
  '/download',
  validate(fileValidation.downloadFileValidation, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  fileController.downloadFile
);

// Export router
module.exports = router;