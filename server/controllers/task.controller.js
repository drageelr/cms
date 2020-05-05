'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Models:
var Submission = require('../models/submission.model');
var Checklist = require('../models/checklist.model');
var CCA = require('../models/cca.model');
var RTask = require('../models/reqtask.model');
var CTask = require('../models/custask.model');
var SubTask = require('../models/subtask.model');
var Status = require('../models/status.model');
var Log = require('../models/log.model');

// Services:
var httpStatus = require('../services/http-status');
var jwt = require('../services/jwt');
var nodemailer = require('../services/nodemailer');

// Others:
var customError = require('../errors/errors');
var helperFuncs = require('../services/helper-funcs');
var config = require('../config/config').variables;

/*
  ------------------ CODE BODY --------------------
*/

// Constants:

/*
  <<<<< HELPER FUNCTIONS >>>>>
*/

function createLogText(targetType, targetId, targetName = "") {
  const typeConversion = {
    rt: "[Request Task]",
    ct: "[Custom Task]",
    st: "[Sub Task]",
    ts: "[Task Status]",
    u: "[User]",
  };

  let text = typeConversion[targetType] + " (ID: " + targetId + ")";

  if (targetName != "") {
    text += " \"" + targetName + "\"";
  }

  return text;
}

/*
  <<<<< EXPORT FUNCTIONS >>>>>
*/

exports.createReqTask = async (req, res, next) => {
  let params = req.body;
  let task = params.task;

  try {
    let reqSubmission = await Submission.findOne({submissionId: task.submissionId}, '_id formId');
    if (!reqSubmission) throw new customError.SubmissionNotFoundError("invalid submissionId"); // raise submission not found error

    let reqCCA = await CCA.findOne({ccaId: task.ownerId}, '_id firstName lastName');
    if(!reqCCA) throw new customError.UserNotFoundError("invalid ownerId"); // raise user not found error

    let reqStatus = await Status.findOne({statusId: task.statusId}, '_id');
    if (!reqStatus) throw new customError.TaskStatusNotFoundError("invalid statusId"); // raise status not found error
    
    let checklistIds = []
    let assigneeIds = []
    if (task.checklistIds) {
      checklistIds = task.checklistIds.map(c => c.checklistId);
      assigneeIds = task.checklistIds.map(c => c.assigneeId);
    }
    
    let reqChecklists = await Checklist.find({checklistId: {$in: checklistIds}, formId: reqSubmission.formId});
    if (reqChecklists.length != checklistIds.length) throw new customError.ChecklistNotFoundError("invalid checklistId"); // throw invalid checklist id(s)

    let reqCCAs = [];
    for (let aId of assigneeIds) {
      let reqCCA = await CCA.findOne({ccaId: aId}, '_id firstName lastName');
      if (reqCCA) {
        let reqCCAObj = helperFuncs.duplicateObject(reqCCA, ["_id", "firstName", "lastName"]);
        reqCCAs.push(reqCCAObj);
      } else {
        throw new customError.UserNotFoundError("invalid assigneeId"); // raise invalid assignee id(s)
      }
    }

    let reqRTask = new RTask({
      title: task.title,
      description: task.description,
      submissionId: reqSubmission._id,
      ownerId: reqCCA._id,
      statusId: reqStatus._id,
      archive: false
    });

    await reqRTask.save();

    let creatorCCA = await CCA.findById(params.userObj._id, 'ccaId firstName lastName');

    let creationText = " created by " + createLogText("u", creatorCCA.ccaId, creatorCCA.firstName + " " + creatorCCA.lastName) + ". ";
    let reqTaskLog = new Log({
      description: createLogText("rt", "r" + reqRTask.taskId) + creationText + "Ownership set to " + createLogText("u", task.ownerId, reqCCA.firstName + " " + reqCCA.lastName)
    })

    await reqTaskLog.save();
    reqRTask.logIds.push(reqTaskLog._id);
    
    let logsToSend = [];
    let subTasksToSend = [];

    logsToSend.push({
      logId: reqTaskLog.logId,
      creatorId: -1,
      description: reqTaskLog.description,
      createdAt: reqTaskLog.createdAt,
      updatedAt: reqTaskLog.updatedAt
    })

    if (reqChecklists.length) {
      for (let i = 0; i < checklistIds.length; i++) {
        let reqSubTask = new SubTask({
          taskId: reqRTask._id,
          assigneeId: reqCCAs[i]._id,
          description: reqChecklists[i].description,
          check: false
        });

        await reqSubTask.save();

        let subTaskLog = new Log({
          description: createLogText("st", reqSubTask.subtaskId) + creationText + " Assigned to " + createLogText("u", assigneeIds[i], reqCCAs[i].firstName + " " + reqCCAs[i].lastName)
        });

        await subTaskLog.save();

        subTasksToSend.push({
          subtaskId: reqSubTask.subtaskId,
          assigneeId: assigneeIds[i],
          description: reqSubTask.description,
          check: reqSubTask.check
        });

        logsToSend.push({
          logId: subTaskLog.logId,
          creatorId: -1,
          description: subTaskLog.description,
          createdAt: subTaskLog.createdAt,
          updatedAt: subTaskLog.updatedAt
        });

        reqRTask.subtaskIds.push(reqSubTask._id);
        reqRTask.logIds.push(subTaskLog._id);
      }
    }

    await reqRTask.save();

    res.json({
      statusCode: 201,
      statusName: httpStatus.getName(201),
      taskId: "r" + reqRTask.taskId,
      subtasks: subTasksToSend,
      logs: logsToSend
    });
  } catch (err) {
    next(err);
  }
}

exports.createCusTask = async (req, res, next) => {
  let params = req.body;
  let task = params.task;

  try {
    let reqCCA = await CCA.findOne({ccaId: task.ownerId}, '_id firstName lastName');
    if(!reqCCA) throw new customError.UserNotFoundError("invalid ownerId"); // raise user not found error

    let reqStatus = await Status.findOne({statusId: task.statusId}, '_id');
    if (!reqStatus) throw new customError.TaskStatusNotFoundError("invalid statusId"); // raise status not found error

    let reqCTask = new CTask({
      title: task.title,
      description: task.description,
      ownerId: reqCCA._id,
      statusId: reqStatus._id,
      archive: false
    });

    await reqCTask.save();

    //create log
    let creatorCCA = await CCA.findById(params.userObj._id, 'ccaId firstName lastName');
    let creationText = " created by " + createLogText("u", creatorCCA.ccaId, creatorCCA.firstName + " " + creatorCCA.lastName) + ". ";
    let reqTaskLog = new Log({
      description: createLogText("rt", "r" + reqCTask.taskId) + creationText + "Ownership set to " + createLogText("u", task.ownerId, reqCCA.firstName + " " + reqCCA.lastName)
    })

    await reqTaskLog.save();

    // add log to custom task as well
    reqCTask.logIds.push(reqTaskLog._id);
    
    let logsToSend = [];

    logsToSend.push({
      logId: reqTaskLog.logId,
      creatorId: -1,
      description: reqTaskLog.description,
      createdAt: reqTaskLog.createdAt,
      updatedAt: reqTaskLog.updatedAt
    })

    res.json({
      statusCode: 201,
      statusName: httpStatus.getName(201),
      taskId: "c" + reqCTask.taskId,
      logs: logsToSend
    });
  } catch (err) {
    next(err);
  }
}

exports.editReqTask = async (req, res, next) => {
  let params = req.body;
  let task = params.task;

  try {
    let reqTask = await RTask.findOne({taskId: parseInt(task.taskId.slice(1))}, '_id');
    if (!reqTask) throw new customError.TaskNotFoundError("invalid taskId"); // raise task not found error

    let reqCCA = await CCA.findById(params.userObj._id, 'ccaId firstName lastName permissions');

    let updateObj = helperFuncs.duplicateObject(task, ['title', 'description'], true);
    let logDesc = createLogText("rt", task.taskId) + " edited by " + createLogText("u", reqCCA.ccaId, reqCCA.firstName + " " + reqCCA.lastName) + ".\nEdits:";

    if (task.archive !== undefined ) {
      if ((task.archive && reqCCA.permissions.archiveTask) || (!task.archive && reqCCA.permissions.unarchive)) {
        updateObj.archive = task.archive;
      } else {
        throw new customError.ForbiddenAccessError("user cant change archive field", "PermissionError"); // raise permission error;
      }
    }

    if (task.ownerId) {
      let newOwner = await CCA.findOne({ccaId: task.ownerId}, 'firstName lastName');
      if (!newOwner) throw new customError.UserNotFoundError("invalid ownerId"); // raise owner not found error
      updateObj.ownerId = newOwner._id;
      logDesc += "\n Ownership set to " + createLogText("u", task.ownerId, newOwner.firstName + " " + newOwner.lastName) + "."; 
    }

    if (task.statusId) {
      let newStatus = await Status.findOne({statusId: task.statusId}, '_id name');
      if (!newStatus) throw new customError.TaskStatusNotFoundError("invalid statusId"); // raise status not found error
      updateObj.statusId = newStatus._id;
      logDesc += "\n Status set to " + createLogText("ts", task.statusId, newStatus.name) + ".";
    }

    if (task.subtasks) {
      let subtaskIds = task.subtasks.map(s => s.subtaskId);
      let reqSubTasks = await SubTask.find({subtaskId: {$in: subtaskIds}, taskId: reqTask._id});
      if (reqSubTasks.length != subtaskIds.length) throw new customError.SubTaskNotFoundError("invalid subtaskId"); // raise one or more id is invalid

      let stUpdateArr = [];
      for (let i = 0; i < reqSubTasks.length; i++) {
        let stUpdateObj = helperFuncs.duplicateObject(task.subtasks[i], ['description', 'check'], true);
        if (task.subtasks[i].assigneeId) {
          let newAssignee = await CCA.findOne({ccaId: task.subtasks[i].assigneeId}, '_id firstName lastName');
          if (!newAssignee) throw new customError.UserNotFoundError("invalid assigneeId"); // raise assingee not found error
          stUpdateObj.assigneeId = newAssignee._id;
        }
        logDesc += "\n" + createLogText("st", task.subtasks[i].subtaskId) + " edited.";
        stUpdateArr.push(stUpdateObj);
      }

      for (let i = 0; i < reqSubTasks.length; i++) {
        await SubTask.findByIdAndUpdate(reqSubTasks[i]._id, stUpdateArr[i]);
      }
    }

    let newLog = new Log({
      description: logDesc
    });

    await newLog.save();

    updateObj['$push'] = {logIds: newLog._id};

    await RTask.findByIdAndUpdate(reqTask._id, updateObj);

    res.json({
      statusCode: 200,
      statusName: httpStatus.getName(200),
      message: "Request Task Successfully Edited!",
      newLog: {
        logId: newLog.logId,
        creatorId: -1,
        description: logDesc,
        createdAt: newLog.createdAt,
        updatedAt: newLog.updatedAt
      }
    });
  } catch (err) {
    next(err);
  }
}

exports.editCusTask = async (req, res, next) => {
  let params = req.body;
  let task = params.task;

  try {
    let reqTask = await CTask.findOne({taskId: parseInt(task.taskId.slice(1))}, '_id');
    if (!reqTask) throw new customError.TaskNotFoundError("invalid taskId"); // raise task not found error

    let reqCCA = await CCA.findById(params.userObj._id, 'ccaId firstName lastName permissions');

    let updateObj = helperFuncs.duplicateObject(task, ['title', 'description'], true);
    let logDesc = createLogText("ct", task.taskId) + " edited by " + createLogText("u", reqCCA.ccaId, reqCCA.firstName + " " + reqCCA.lastName) + ".\nEdits:";

    if (task.archive !== undefined ) {
      if ((task.archive && reqCCA.permissions.archiveTask) || (!task.archive && reqCCA.permissions.unarchive)) {
        updateObj.archive = task.archive;
      } else {
        throw new customError.ForbiddenAccessError("user cant change archive field", "PermissionError"); // raise permission error;
      }
    }

    if (task.ownerId) {
      let newOwner = await CCA.findOne({ccaId: task.ownerId}, '_id firstName lastName');
      if (!newOwner) throw new customError.UserNotFoundError("invalid ownerId"); // raise owner not found error
      updateObj.ownerId = newOwner._id;
      logDesc += "\n Ownership set to " + createLogText("u", task.ownerId, newOwner.firstName + " " + newOwner.lastName) + "."; 
    }

    if (task.statusId) {
      let newStatus = await Status.findOne({statusId: task.statusId}, '_id name');
      if (!newStatus) throw new customError.TaskStatusNotFoundError("invalid statusId"); // raise status not found error
      updateObj.statusId = newStatus._id;
      logDesc += "\n Status set to " + createLogText("ts", task.statusId, newStatus.name) + ".";
    }

    let newLog = new Log({
      description: logDesc
    });

    await newLog.save();

    updateObj['$push'] = {logIds: newLog._id};

    await CTask.findByIdAndUpdate(reqTask._id, updateObj);

    res.json({
      statusCode: 200,
      statusName: httpStatus.getName(200),
      message: "Custom Task Successfully Edited!",
      newLog: {
        logId: newLog.logId,
        creatorId: -1,
        description: logDesc,
        createdAt: newLog.createdAt,
        updatedAt: newLog.updatedAt
      }
    });
  } catch (err) {
    next(err);
  }
}

exports.addLog = async (req, res, next) => {
  let params = req.body;

  try {
    let reqTask = false;

    if (params.taskId[0] == "r") {
      reqTask = await RTask.findOne({taskId: parseInt(params.taskId.splice(1))});
    } else if (params.taskId[0] == "c") {
      reqTask = await CTask.findOne({taskId: parseInt(params.taskId.splice(1))});
    }

    if (!reqTask) throw new customError.TaskNotFoundError("invalid taskId"); // raise task not found error

    let newLog = new Log({
      creatorId: params.userObj._id,
      description: params.description
    });

    await newLog.save();

    reqTask.logIds.push(newLog._id);

    await reqTask.save();

    res.json({
      statusCode: 201,
      statusName: httpStatus.getName(201),
      message: "Log Successfully Created!",
      logId: newLog.logId,
      createdAt: newLog.createdAt,
      updatedAt: newLog.updatedAt
    });
  } catch (err) {
    next(err);
  }
}

exports.fetchTaskManager = async (req, res, next) => {
  try {
    let taskList = [];
    
    let reqRTasks = await RTask.find({archive: false});
    
    for (let r of reqRTasks) {
      let taskObj = helperFuncs.duplicateObject(r, ['taskId', 'title', 'description', 'archive', "createdAt", "updatedAt"]);
      taskObj.taskId = "r" + taskObj.taskId;

      let reqCCA = await CCA.findById(r.ownerId, 'ccaId');
      taskObj.ownerId = reqCCA.ccaId;

      let reqStatus = await Status.findById(r.statusId, 'statusId');
      taskObj.statusId = reqStatus.statusId;

      taskObj.subtasks = [];
      for (let sId of r.subtaskIds) {
        let reqSubTask = await SubTask.findById(sId, 'subtaskId assigneeId description check');
        let subtaskObj = helperFuncs.duplicateObject(reqSubTask, ["subtaskId", "description", "check"]);

        let subtaskCCA = await CCA.findById(reqSubTask.assigneeId, 'ccaId');
        subtaskObj.assigneeId = subtaskCCA.ccaId;

        taskObj.subtasks.push(subtaskObj);
      }

      taskObj.logs = [];
      for (let lId of r.logIds) {
        let reqLog = await Log.findById(lId, 'logId creatorId description createdAt updatedAt');
        let logObj = helperFuncs.duplicateObject(reqLog, ["logId", "description", "createdAt", "updatedAt"]);

        if (reqLog.creatorId){
          let logCCA = await CCA.findById(reqLog.creatorId, 'ccaId');
          logObj.creatorId = logCCA.ccaId;
        } else {
          logObj.creatorId = -1;
        }

        taskObj.logs.push(logObj);
      }

      taskList.push(taskObj);
    }

    let reqCTask = await CTask.find({archive: false});

    for (let c of reqCTask) {
      let taskObj = helperFuncs.duplicateObject(c, ['taskId', 'title', 'description', 'archive', "createdAt", "updatedAt"]);
      taskObj.taskId = "c" + taskObj.taskId;

      let reqCCA = await CCA.findById(c.ownerId, 'ccaId');
      taskObj.ownerId = reqCCA.ccaId;

      let reqStatus = await Status.findById(c.statusId, 'statusId');
      taskObj.statusId = reqStatus.statusId;

      taskObj.logs = [];
      for (let lId of c.logIds) {
        let reqLog = await Log.findById(lId, 'logId creatorId description createdAt updatedAt');
        let logObj = helperFuncs.duplicateObject(reqLog, ["logId", "description", "createdAt", "updatedAt"]);

        if (reqLog.creatorId){
          let logCCA = await CCA.findById(reqLog.creatorId, 'ccaId');
          logObj.creatorId = logCCA.ccaId;
        } else {
          logObj.creatorId = -1;
        } 
        
        taskObj.logs.push(logObj);
      }

      taskList.push(taskObj);
    }

    if (!reqRTasks.length && !reqCTask.length) throw new customError.TaskNotFoundError("no tasks exist"); // throw task not found error

    res.json({
      statusCode: 200,
      statusName: httpStatus.getName(200),
      message: "Task Manager Successfully Fetched!",
      taskList: taskList
    });
  } catch (err) {
    next(err);
  }
}

exports.fetchArchiveManager = async (req, res, next) => {
  try {
    let taskList = [];
    
    let reqRTasks = await RTask.find({archive: true});
    
    for (let r of reqRTasks) {
      let taskObj = helperFuncs.duplicateObject(r, ['taskId', 'title', 'archive', 'createdAt', 'updatedAt']);
      taskObj.taskId = "r" + taskObj.taskId;

      let reqCCA = await CCA.findById(r.ownerId, 'ccaId');
      taskObj.ownerId = reqCCA.ccaId;

      taskList.push(taskObj);
    }

    let reqCTask = await CTask.find({archive: true});

    for (let c of reqCTask) {
      let taskObj = helperFuncs.duplicateObject(c, ['taskId', 'title', 'archive', 'createdAt', 'updatedAt']);
      taskObj.taskId = "c" + taskObj.taskId;

      let reqCCA = await CCA.findById(c.ownerId, 'ccaId');
      taskObj.ownerId = reqCCA.ccaId;

      taskList.push(taskObj);
    }

    if (!reqRTasks.length && !reqCTask.length) throw new customError.TaskNotFoundError("no tasks exist"); // throw task not found error

    res.json({
      statusCode: 200,
      statusName: httpStatus.getName(200),
      message: "Archive Manager Manager Successfully Fetched!",
      taskList: taskList
    });
  } catch (err) {
    next(err);
  }
}

exports.fetchTask = async (req, res, next) => {
  let params = req.body;

  try {
    let reqTask = false;

    if (params.taskId[0] == "r") {
      reqTask = await RTask.findOne({taskId: parseInt(params.taskId.splice(1))});
    } else if (params.taskId[0] == "c") {
      reqTask = await CTask.findOne({taskId: parseInt(params.taskId.splice(1))});
    }

    if (!reqTask) throw new customError.TaskNotFoundError("invalid taskId");

    let taskObj = helperFuncs.duplicateObject(reqTask, ['taskId', 'title', 'description', 'archive', "createdAt", "updatedAt"]);
    taskObj.taskId = params.taskId[0] + taskObj.taskId;

    let reqCCA = await CCA.findById(reqTask.ownerId, 'ccaId');
    taskObj.ownerId = reqCCA.ccaId;

    let reqStatus = await Status.findById(reqTask.statusId, 'statusId');
    taskObj.statusId = reqStatus.statusId;

    taskObj.logs = [];
    for (let lId of reqTask.logIds) {
      let reqLog = await Log.findById(lId, 'logId creatorId description createdAt updatedAt');
      let logObj = helperFuncs.duplicateObject(reqLog, ["logId", "description", "createdAt", "updatedAt"]);

      if (reqLog.creatorId){
        let logCCA = await CCA.findById(reqLog.creatorId, 'ccaId');
        logObj.creatorId = logCCA.ccaId;
      } else {
        logObj.creatorId = -1;
      }

      taskObj.logs.push(logObj);
    }

    if (params.taskId[0] == "r") {
      taskObj.subtasks = [];
      for (let sId of reqTask.subtaskIds) {
        let reqSubTask = await SubTask.findById(sId, 'subtaskId assigneeId description check');
        let subtaskObj = helperFuncs.duplicateObject(reqSubTask, ["subtaskId", "description", "check"]);

        let subtaskCCA = await CCA.findById(reqSubTask.assigneeId, 'ccaId');
        subtaskObj.assigneeId = subtaskCCA.ccaId;

        taskObj.subtasks.push(subtaskObj);
      }
    }

    res.json({
      statusCode: 200,
      statusName: httpStatus.getName(200),
      message: "Task Successfully Fetched!",
      task: taskObj
    });
  } catch (err) {
    next(err);
  }
}

exports.createTaskStatus = async (req, res, next) => {
  let params = req.body;

  try {
    let reqStatus = new Status({
      name: params.name,
      color: params.color
    });

    await reqStatus.save();

    res.json({
      statusCode: 201,
      statusName: httpStatus.getName(201),
      message: "Task Status Successfully Created!",
      statusId: reqStatus.statusId
    });
  } catch (err) {
    next(err);
  }
}

exports.editTaskStatus = async (req, res, next) => {
  let params = req.body;

  try {
    let reqStatus = await Status.findOne({statusId: params.statusId}, '_id');
    if (!reqStatus) throw new customError.TaskStatusNotFoundError("invalid statusId"); // raise status not found error

    let updateObj = helperFuncs.duplicateObject(params, ['name', 'color'], true);

    await Status.findByIdAndUpdate(reqStatus._id, updateObj);

    res.json({
      statusCode: 203,
      statusName: httpStatus.getName(203),
      message: "Task Status Successfully Updated!",
    });
  } catch (err) {
    next(err);
  }
}

exports.deleteTaskStatus = async (req, res, next) => {
  let params = req.body;

  try {
    let reqStatus = await Status.findOne({statusId: params.statusId}, '_id');
    if (!reqStatus) throw new customError.TaskStatusNotFoundError("invalid statusId"); // raise status not found error

    await Status.findByIdAndDelete(reqStatus._id);

    res.json({
      statusCode: 203,
      statusName: httpStatus.getName(203),
      message: "Task Status Successfully Deleted!",
    });
  } catch (err) {
    next(err);
  }
}

exports.fetchTaskStatuses = async (req, res, next) => {
  try {
    let reqStatuses = await Status.find({});
    if (!reqStatuses.length) throw new customError.TaskStatusNotFoundError("no statuses exist"); // raise status not found error

    let statusList = [];
    for (let s of reqStatuses) {
      let statusObj = helperFuncs.duplicateObject(s, ["statusId", "name", "color"]);
      statusList.push(statusObj);
    }

    res.json({
      statusCode: 200,
      statusName: httpStatus.getName(200),
      message: "Task Statuses Successfully Fetched!",
      statuses: statusList
    });
  } catch (err) {
    next(err);
  }
}