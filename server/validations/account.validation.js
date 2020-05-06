'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Modules:
var Joi = require('express-validation').Joi;

/*
  ------------------ CODE BODY --------------------
*/

// Export API 2.1 Validation Object:
exports.ccaCreateAccount = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{8,30}/).required(),
    role: Joi.string().regex(/^(admin|member)/).required(),
    firstName: Joi.string().min(1).max(30).required(),
    lastName: Joi.string().min(1).max(30).required(),
    picture: Joi.string().required(),
    permissions: {
      societyCRUD: Joi.bool().required(),
      ccaCRUD: Joi.bool().required(),
      accessFormMaker: Joi.bool().required(),
      createReqTask: Joi.bool().required(),
      createCustomTask: Joi.bool().required(),
      createTaskStatus: Joi.bool().required(),
      archiveTask: Joi.bool().required(),
      unarchiveTask: Joi.bool().required(),
      setFormStatus: Joi.bool().required(),
      addCCANote: Joi.bool().required()
    }
  })
};

// Export API 2.2 Validation Object:
exports.societyCreateAccount = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{8,30}/).required(),
    name: Joi.string().min(1).max(100).required(),
    nameInitials: Joi.string().min(1).max(10).required(),
    presidentEmail: Joi.string().email().required(),
    patronEmail: Joi.string().email().required(),
  })
};

// Export API 2.3 Validation Object:
exports.ccaEditAccount = {
  body: Joi.object({
    ccaId: Joi.number().required(),
    email: Joi.string().email(),
    password: Joi.string().regex(/[a-zA-Z0-9]{8,30}/),
    role: Joi.string().regex(/^(admin|member)/),
    firstName: Joi.string().min(1).max(30),
    lastName: Joi.string().min(1).max(30),
    picture: Joi.string(),
    permissions: {
      societyCRUD: Joi.bool(),
      ccaCRUD: Joi.bool(),
      accessFormMaker: Joi.bool(),
      createReqTask: Joi.bool(),
      createCustomTask: Joi.bool(),
      createTaskStatus: Joi.bool(),
      archiveTask: Joi.bool(),
      unarchiveTask: Joi.bool(),
      setFormStatus: Joi.bool(),
      addCCANote: Joi.bool()
    },
    active: Joi.bool(),
    themeColor: Joi.string(),
    darkMode: Joi.bool()
  })
};

// Export API 2.4 Validation Object:
exports.societyEditAccount = {
  body: Joi.object({
    societyId: Joi.number(),
    email: Joi.string().email(),
    password: Joi.string().regex(/[a-zA-Z0-9]{8,30}/),
    name: Joi.string().min(1).max(100),
    nameInitials: Joi.string().min(1).max(10),
    presidentEmail: Joi.string().email(),
    patronEmail: Joi.string().email(),
    active: Joi.bool(),
    themeColor: Joi.string(),
    darkMode: Joi.bool()
  })
};

// Export API 2.7 + 2.8 Validation Object:
exports.changePassword = {
  body: Joi.object({
    passwordCurrent: Joi.string().regex(/[a-zA-Z0-9]{8,30}/),
    passwordNew: Joi.string().regex(/[a-zA-Z0-9]{8,30}/),
  })
};

// Export API 2.9 Validation Object:
exports.changeCCAPicture = {
  body: Joi.object({
    picture: Joi.string().required()
  })
};

// Export API 2.10 Validation Object:
exports.changeSocietyTheme = {
  body: Joi.object({
    themeColor: Joi.string(),
    darkMode: Joi.bool()
  })
}