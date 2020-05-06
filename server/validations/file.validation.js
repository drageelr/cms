'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Modules:
var Joi = require('express-validation').Joi;

/*
  ------------------ CODE BODY --------------------
*/

// Export API 6.2 Validation Object:
exports.downloadFileValidation = {
  body: Joi.object({
    submissionId: Joi.number().required(),
    itemId: Joi.number().required()
  })
};