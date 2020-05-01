'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Modules:
var Joi = require('express-validation').Joi;

/*
  ------------------ CODE BODY --------------------
*/

// Export API 4.1 Validation Object:
exports.submitFormValidation = {
  body: Joi.object({
    formId: Joi.number().required(),
    submissionId: Joi.number(),
    itemsData: Joi.array().items(Joi.object({
      itemId: Joi.number().required(),
      data: Joi.any().required()
    }))
  })
}

// Export API 4.2 Validation Object:
exports.addCCANoteValidation = {
  body: Joi.object({
    submissionId: Joi.number().required(),
    note: Joi.string().min(1).max(100).required()
  })
}

// Export API 4.3 Validation Object:
exports.addSocietyNoteValidation = {
  body: Joi.object({
    submissionId: Joi.number().required(),
    note: Joi.string().min(1).max(100).required()
  })
}

// Export API 4.4 Validation Object:
exports.getSubmissionListValidation = {
  body: Joi.object({
    showCompleted: Joi.boolean(),
  })
}

// Export API 4.5 Validation Object:
exports.updateSubmissionStatusValidation = {
  body: Joi.object({
    submissionId: Joi.number().required(),
    status: Joi.string().required(),
    issue: Joi.string().min(1).max(500)
  })
}

// Export API 4.6 Validation Object:
exports.fetchSubmissionValidation = {
  body: Joi.object({
    submissionId: Joi.number().required()
  })
}