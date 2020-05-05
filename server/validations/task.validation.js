'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Modules:
var Joi = require('express-validation').Joi;

/*
  ------------------ CODE BODY --------------------
*/

// Export API 5.1 Validation Object:
exports.createReqTaskValidation = {
  body: Joi.object({
    task: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      submissionId: Joi.number().required(),
      ownerId: Joi.number().required(),
      statusId: Joi.number().required(),
      checklistIds: Joi.array().items(Joi.object({
        checklistId: Joi.number().required(),
        assigneeId: Joi.number().required()
      }))
    }).required()
  })
}

// Export API 5.2 Validation Object:
exports.createCusTaskValidation = {
  body: Joi.object({
    task: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      ownerId: Joi.number().required(),
      statusId: Joi.number().required(),
    }).required()
  })
}

// Export API 5.3 Validation Object:
exports.editReqTaskValidation = {
  body: Joi.object({
    task: Joi.object({
      taskId: Joi.string().min(2).required(),
      title: Joi.string(),
      description: Joi.string(),
      ownerId: Joi.number(),
      statusId: Joi.number(),
      subtasks: Joi.array().items(Joi.object({
        subtaskId: Joi.number().required(),
        assigneeId: Joi.number(),
        description: Joi.string(),
        check: Joi.bool()
      }))
    })
  })
}

// Export API 5.4 Validation Object:
exports.editCusTaskValidation = {
  body: Joi.object({
    task: Joi.object({
      taskId: Joi.string().min(2).required(),
      title: Joi.string(),
      description: Joi.string(),
      ownerId: Joi.number(),
      statusId: Joi.number(),
    }).required()
  })
}

// Export API 5.5 Validation Object:
exports.addLogValidation = {
  body: Joi.object({
    taskId: Joi.string().min(2).required(),
    description: Joi.string().required()
  })
}

// Export API 5.8 Validation Object:
exports.fetchTaskValidation = {
  body: Joi.object({
    taskId: Joi.string().min(2).required()
  })
}

// Export API 5.9 Validation Object:
exports.createTaskStatusValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    color: Joi.string().required()
  })
}

// Export API 5.10 Validation Object:
exports.editTaskStatusValidation = {
  body: Joi.object({
    statusId: Joi.number().required(),
    name: Joi.string(),
    color: Joi.string()
  })
}

// Export API 5.11 Validation Object:
exports.deleteTaskStatusValidation = {
  body: Joi.object({
    statusId: Joi.number().required(),
  })
}