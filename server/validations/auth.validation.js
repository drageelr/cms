'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Modules:
var Joi = require('express-validation').Joi;

/*
  ------------------ CODE BODY --------------------
*/

// Export API 1.1 + 1.2 Validation Object:
exports.loginValidation = {
  body: Joi.object({
    email: Joi.string().email({tlds: {allow: ['lums.edu.pk']}}).required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{8,30}/).required()
  })
};