'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Modules:
var Joi = require('express-validation').Joi;

/*
  ------------------ CODE BODY --------------------
*/

// Export Society Validation Object:
exports.societyLoginValidation = {
  body: Joi.object({
    email: Joi.string().email({tlds: {allow: ['lums.edu.pk']}}).required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{8,30}/).required()
  })
};

// Export CCA Validation Object:
exports.ccaLoginValidation = {
  body: Joi.object({
    email: Joi.string().email({tlds: {allow: ['lums.edu.pk']}}).required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{8,30}/).required()
  })
};