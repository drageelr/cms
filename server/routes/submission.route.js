'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Others:
var router = require('express').Router();
var validate = require('express-validation').validate;
var jwt = require('../services/jwt');
var formValidation = require('../validations/form.validation');
var submissionValidation = require('../validations/submission.validation');
var formController = require('../controllers/form.controller');
var submissionController = require('../controllers/submission.controller');
var { validateUserAccess, validateCCAAccess } = require('../services/access-validator');

/*
  ------------------ CODE BODY --------------------
*/

// API 4.1: Submit Form
router.post(
  '/submit',
  validate(submissionValidation.submitFormValidation, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  submissionController.submitForm
);

// API 4.2: Add CCA Note
router.post(
  '/cca/add-note',
  validate(submissionValidation.addCCANoteValidation, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  submissionController.addCCANote
);

// API 4.3: Add Society Note
router.post(
  '/society/add-note',
  validate(submissionValidation.addSocietyNoteValidation, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  submissionController.addSocietyNote
);

// API 4.4: Fetch Submission List
router.post(
  '/fetch-list',
  validate(submissionValidation.getSubmissionListValidation, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  submissionController.getSubmissionList
);

// API 4.5: Update Submission Status
router.post(
  '/update-status',
  validate(submissionValidation.updateSubmissionStatusValidation, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  submissionController.updateSubmissionStatus
);

// API 4.6: Fetch Submission
router.post(
  '/fetch',
  validate(submissionValidation.fetchSubmissionValidation, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  submissionController.fetchSubmission
);

// API 4.7: Fetch Review Data
router.post(
  '/fetch-review',
  jwt.verify,
  validateUserAccess,
  submissionController.fetchReviewData
);

// Export router
module.exports = router;