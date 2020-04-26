'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Modules:
var Joi = require('express-validation').Joi;

/*
  ------------------ CODE BODY --------------------
*/

// Section Schema:
const sectionSchema = Joi.object({
  sectionId: Joi.number().required(),
  title: Joi.string().min(1).max(100).required(),
  componentsOrder: Joi.array().items(Joi.number()).required()
});

// Component Schema:
const componentSchema = Joi.object({
  componentId: Joi.number().required(),
  title: Joi.string().min(1).max(100),
  itemsOrder: Joi.array().items(Joi.number()).required()
});

// Item Schema:
const itemSchema = Joi.object({
  itemId: Joi.number().required(),
  type: Joi.string().required(),
  label: Joi.string().required(),
  required: Joi.bool().required(),
  defaultVisibility: Joi.bool().required(),
  placeHolder: Joi.string(),
  maxLength: Joi.number(),
  options: Joi.array().items(Joi.object({
    optionId: Joi.number().required(),
    data: Joi.string().required()
  })),
  conditionalItems: Joi.array().items(Joi.object({
    optionId: Joi.number().required(),
    itemId: Joi.array().items(Joi.number()).required()
  })),
  fileTypes: Joi.string()
});

// Export API 3.1 Validation Object:
exports.createFormValidation = {
  body: Joi.object({
    form: {
      title: Joi.string().min(1).max(100).required(),
      isPublic: Joi.bool().required(),
      sections: Joi.array().items(sectionSchema).required(),
      components: Joi.array().items(componentSchema).required(),
      items: Joi.array().items(itemSchema).required(),
      checklistItems: Joi.array().items(Joi.object({
        sectionId: Joi.number().required(),
        description: Joi.string().required()
      }))
    }
  })
}

// Export API 3.2 Validation Object:
exports.editFormValidation = {
  body: Joi.object({
    form: {
      formId: Joi.number().required(),
      title: Joi.string().min(1).max(100).required(),
      isPublic: Joi.bool().required(),
      sections: Joi.array().items(sectionSchema).required(),
      components: Joi.array().items(componentSchema).required(),
      items: Joi.array().items(itemSchema).required(),
      checklistItems: [{
        checklistId: Joi.number(),
        sectionId: Joi.number().required(),
        description: Joi.string().required()
      }]
    }
  })
}

// Export API 3.4 Validation Object:
exports.fetchFormValidation = {
  body: Joi.object({
    formId: Joi.number().required(),
  })
}