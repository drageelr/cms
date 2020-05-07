'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Others:
var router = require('express').Router();
var validate = require('express-validation').validate;
var jwt = require('../services/jwt');
var taskValidation = require('../validations/task.validation');
var taskController = require('../controllers/task.controller');
var { validateUserAccess, validateCCAAccess } = require('../services/access-validator');

/*
  ------------------ CODE BODY --------------------
*/

// API 5.1: Create Request Task
router.post(
  '/task/req/create',
  validate(taskValidation.createReqTaskValidation, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  taskController.createReqTask
);

// API 5.2: Create Custom Task
router.post(
  '/task/cus/create',
  validate(taskValidation.createCusTaskValidation, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  taskController.createCusTask
);

// API 5.3: Edit Request Task
router.post(
  '/task/req/edit',
  validate(taskValidation.editReqTaskValidation, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  taskController.editReqTask
);

// API 5.4: Edit Custom Task
router.post(
  '/task/cus/edit',
  validate(taskValidation.editCusTaskValidation, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  taskController.editCusTask
);

// API 5.5: Add Log
router.post(
  '/log/add',
  validate(taskValidation.addLogValidation, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  taskController.addLog
);

// API 5.6: Fetch Task Manager
router.post(
  '/fetch',
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  taskController.fetchTaskManager
);

// API 5.7: Fetch Archive Manager
router.post(
  '/fetch-archive',
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  taskController.fetchArchiveManager
);

// API 5.8: Fetch Task
router.post(
  '/task/fetch',
  validate(taskValidation.fetchTaskValidation, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  taskController.fetchTask
)

// API 5.9: Create Task Status
router.post(
  '/task-status/create',
  validate(taskValidation.createTaskStatusValidation, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  taskController.createTaskStatus
);

// API 5.10: Edit Task Status
router.post(
  '/task-status/edit',
  validate(taskValidation.editTaskStatusValidation, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  taskController.editTaskStatus
);

// API 5.11: Delete Task Status
router.post(
  '/task-status/delete',
  validate(taskValidation.deleteTaskStatusValidation, { keyByField: true }),
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  taskController.deleteTaskStatus
);

// API 5.12: Fetch Task Statuses
router.post(
  '/task-status/fetch-all',
  jwt.verify,
  validateUserAccess,
  validateCCAAccess,
  taskController.fetchTaskStatuses
);

// Export router
module.exports = router;