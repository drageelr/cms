'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Models:
var CCA = require('../models/cca.model');
var Form = require('../models/form.model');
var Checklist = require('../models/checklist.model');
var Submission = require('../models/submission.model');
var RTask = require('../models/reqtask.model');
var SubTask = require('../models/subtask.model');
var File = require('../models/file.model');

// Services:
var httpStatus = require('../services/http-status');

// Others:
var customError = require('../errors/errors');
var helperFuncs = require('../services/helper-funcs');

/*
  ------------------ CODE BODY --------------------
*/

// Constants:
const itemTypes = {
  textbox: ["itemId", "type", "label", "placeHolder", "maxLength", "required", "defaultVisibility"],
  textlabel: ["itemId", "type", "label", "required", "defaultVisibility"],
  dropdown: ["itemId", "type", "label", "options", "conditionalItems", "required", "defaultVisibility"],
  radio: ["itemId", "type", "label", "options", "conditionalItems", "required", "defaultVisibility"],
  checkbox: ["itemId", "type", "label", "required", "defaultVisibility"],
  file: ["itemId", "type", "label", "fileTypes", "required", "defaultVisibility"]
}

/*
  <<<<< HELPER FUNCTIONS >>>>>
*/

function validateItemType (item) {
  let itemKeys = Object.keys(item);
  if (!helperFuncs.compareLists(itemKeys, itemTypes[item.type])) {
    return "item with id " + item.itemId + " should have only these keys: " + JSON.stringify(itemTypes[item.type]);
  }
  
  // Check For Duplicate Option Ids:
  if (item.options) {
    let options = item.options;
    let optionIds = [];
    for (let o of options) {
      let oIdIndex = optionIds.indexOf(o.optionId);
      if (oIdIndex < 0) {
        optionIds.push(o.optionId);
      } else {
        return "item with id " + item.itemId + " has non unqiue option ids";
      }
    }
    // Conditional Items missing here!
  }

  return false;
}

function validateForm (params) {
  // Check For Duplicate Ids:

  // Items:
  let items = params.items;
  let itemIds = [];
  for (let i of items) {
    let iIdIndex = itemIds.indexOf(i.itemId);
    if (iIdIndex < 0) {
      itemIds.push(i.itemId);

      // Validate Item Based On Type:
      let itemKeyError = validateItemType(i);
      if(itemKeyError) { return itemKeyError }
    } else {
      return "item ids not unqiue";
    }
  }

  // Components:
  let components = params.components;
  let componentIds = [];
  for (let c of components) {
    let cIdIndex = componentIds.indexOf(c.componentId);
    if (cIdIndex < 0) {
      componentIds.push(c.componentId);

      // Validate Duplicate Use Of Items:
      for (let iId of c.itemsOrder) {
        let index = itemIds.indexOf(iId);
        if (index > -1) {
          itemIds.splice(index, 1);
        } else {
          return "item with id " + iId + " used in multiple components or does not exist";
        }
      }

    } else {
      return "component ids not unique";
    }
  }

  // Sections:
  let sections = params.sections;
  let sectionIds = [];
  for (let s of sections) {
    let sIdIndex = sectionIds.indexOf(s.sectionId);
    if (sIdIndex < 0)
    {
      sectionIds.push(s.sectionId);

      // Validate Duplicate Use Of Components:
      for (let cId of s.componentsOrder) {
        let index = componentIds.indexOf(cId);
        if (index > -1) {
          componentIds.splice(index, 1);
        } else {
          return "component with id " + cId + " used in multiple sections or does not exist";
        }
      }
    } else {
      return "section ids not unique";
    }
  }

  // Valdiate Checklist:
  let checklistItems = params.checklistItems;
  if (checklistItems) {
    for (let c of checklistItems) {
      let index = sectionIds.indexOf(c.sectionId);
      if (index < 0) { return "checklist references a non existent section with id " + c.sectionId }
    }
  }

  return false;
}

/*
  <<<<< EXPORT FUNCTIONS >>>>>
*/

/**
 * CCA member creates a form and
 * specifies all functionalities associated to it.
 */
// API 3.1 Controller
exports.createForm = async (req, res, next) => {
  let params = req.body;

  try {
    let formValidationError = validateForm(params.form);

    if (!formValidationError) {
      let reqForm = new Form({
        creatorId: params.userObj._id,
        title: params.form.title,
        isPublic: params.form.isPublic,
        sections: params.form.sections,
        components: params.form.components,
        items: params.form.items
      });

      await reqForm.save();

      let checklistIds = [];
      if (params.form.checklistItems) {
        for (let i = 0; i < params.form.checklistItems.length; i++) {
          let reqChecklist = new Checklist({
            formId: reqForm._id,
            sectionId: params.form.checklistItems[i].sectionId,
            description: params.form.checklistItems[i].description
          });

          await reqChecklist.save();

          checklistIds.push(reqChecklist.checklistId);
        }
      }
    
      res.json({
        statusCode: 201,
        statusName: httpStatus.getName(201),
        message: "Form Successfully Created",
        formId: reqForm.formId,
        checklistIds: checklistIds
      });
    } else {
      // throw form validation error
      throw new customError.FormValidationError(formValidationError);
    }
  } catch (err) {
    next(err);
  }
}

/**
 * CCA member edits a form which was
 * previously created.
 */
//API 3.2 Controller
exports.editForm = async (req, res, next) => {
  let params = req.body;

  try {
    let reqForm = await Form.findOne({formId: params.form.formId});

    if (reqForm) {
      let formValidationError = validateForm(params.form);

      if (!formValidationError) {

        // Update Checklists and remove ones which were not specified:
        let checklistIds = [];
        if (params.form.checklistItems) {
          for (let i = 0; i < params.form.checklistItems.length; i++) {
            let cId = params.form.checklistItems[i].checklistId;

            let reqChecklist;

            if (cId) {
              reqChecklist = await Checklist.findOneAndUpdate(
                {
                  formId: reqForm._id,
                  checklistId: cId
                },
                {
                  formId: reqForm._id,
                  sectionId: params.form.checklistItems[i].sectionId,
                  description: params.form.checklistItems[i].description
                },
                {
                  upsert: true,
                }               
              );
            } else {
              reqChecklist = new Checklist({
                formId: reqForm._id,
                sectionId: params.form.checklistItems[i].sectionId,
                description: params.form.checklistItems[i].description
              });

              await reqChecklist.save();
            }

            checklistIds.push(reqChecklist.checklistId);
          }

          await Checklist.deleteMany({checklistId: {$nin: checklistIds}, formId: reqForm._id});
        }

        // Delete sub docs from Form:
        await Promise.all([reqForm.sections.remove(), reqForm.components.remove(), reqForm.items.remove()]);

        // Update Form:
        await reqForm.update({
          title: params.form.title,
          isPublic: params.form.isPublic,
          sections: params.form.sections,
          components: params.form.components,
          items: params.form.items
        });

        res.json({
          statusCode: 200,
          statusName: httpStatus.getName(200),
          message: "Form Successfully Updated!",
          formId: reqForm.formId,
          checklistIds: checklistIds
        });
      } else {
        // throw form validation error
        throw new customError.FormValidationError(formValidationError);
      }
    } else {
      // throw invalid form id error
      throw new customError.FormValidationError("form does not exist");
    }
  } catch (err) {
    next(err);
  }
}

/**
 * CCA member deletes an existing
 * form template. 
 */
// API 3.3 Controller
exports.deleteForm = async (req, res, next) => {
  let params = req.body;

  try {
    let reqForm = await Form.findOne({formId: params.formId}, '_id');
    if (!reqForm) throw new customError.FormNotFoundError("invalid formId");

    let reqSubmissions = await Submission.find({formId: reqForm._id}, '_id');

    let submissionIds = reqSubmissions.map(s => s._id);

    let reqRTasks = await RTask.find({submissionId: {$in: submissionIds}}, '_id');

    let taskIds = reqRTasks.map(t => t._id);

    await Promise.all([
      Form.findByIdAndDelete(reqForm._id),
      File.updateMany({formId: reqForm._id}, {saved: false}),
      Submission.deleteMany({_id: {$in: submissionIds}}),
      RTask.deleteMany({_id: taskIds}),
      SubTask.deleteMany({taskId: {$in: taskIds}})
    ]);

    res.json({
      statusCode: 200,
      statusName: httpStatus.getName(200),
      message: "Form and all related Submissions, Tasks and SubTasks have been deleted!"
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Fetches an existing form template
 * from the database.
 */
// API 3.4 Controller
exports.fetchForm = async (req, res, next) => {
  let params = req.body;

  try {
    let reqForm = await Form.findOne({formId: params.formId});
    
    if (reqForm) {
      let creatorId = await CCA.findById(reqForm.creatorId, 'ccaId');

      let formObj = {
        formId: reqForm.formId,
        isPublic: reqForm.isPublic,
        title: reqForm.title,
        creatorId: creatorId.ccaId,
        sections: [],
        components: [],
        items: []
      }

      for (let i = 0; i < reqForm.sections.length; i++) {
        formObj.sections[i] = helperFuncs.duplicateObject(reqForm.sections[i], ["sectionId", "title", "componentsOrder"]);
      }

      for (let i = 0; i < reqForm.components.length; i++) {
        formObj.components[i] = helperFuncs.duplicateObject(reqForm.components[i], ["componentId", "title", "itemsOrder"]);
      }

      for (let i = 0; i < reqForm.items.length; i++) {
        formObj.items[i] = helperFuncs.duplicateObject(reqForm.items[i], ["itemId", "type", "label", "required", "defaultVisibility", "placeHolder", "maxLength", "fileTypes"], true);
      
        if (reqForm.items[i].options.length) {
          formObj.items[i].options = [];
          for (let s of reqForm.items[i].options) {
            formObj.items[i].options.push(helperFuncs.duplicateObject(s, ["optionId", "data"]));
          }
        }

        if (reqForm.items[i].conditionalItems.length) {
          formObj.items[i].conditionalItems = reqForm.items[i].conditionalItems.map(c => ({"optionId": c.optionId, "itemIds": c.itemIds}));
        }
      }

      if (params.userObj.type == "cca") {
        let reqChecklist = await Checklist.find({formId: reqForm._id});

        if (reqChecklist.length) {
          formObj.checklist = [];
          
          for (let c of reqChecklist) {
            formObj.checklist.push(helperFuncs.duplicateObject(c, ["checklistId", "sectionId", "description"]))
          }
        }
      }

      res.json({
        statusCode: 200,
        statusName: httpStatus.getName(200),
        message: "Fetch Successful!",
        form: formObj
      })
    } else {
      // raise form not found error
      throw new customError.FormNotFoundError("invalid form id");
    }
    
  } catch (err) {
    next(err);
  }
}

/**
 * Fetches a list of all available 
 * forms.
 */
// API 3.5 Controller
exports.fetchFormList = async (req, res, next) => {
  let params = req.body;
  
  try {
    let queryObj = {};
    let fullAccess = true;
    
    if (params.userObj.type == "soc") {
      queryObj.isPublic = true;
      fullAccess = false;
    }

    let reqForms = await Form.find(queryObj, 'formId title creatorId isPublic updatedAt');

    if (reqForms.length) {
      let resObj = {
        statusCode: 200,
        statusName: httpStatus.getName(200),
        message: "List Fetched Successfully!",
        formList: []
      }

      for (let f of reqForms) {
        let formObj = helperFuncs.duplicateObject(f, ["formId", "title", "isPublic"])
        if (fullAccess) {
          formObj.timestampModified = f.updatedAt;
          let formCreator = await CCA.findById(f.creatorId, 'firstName lastName');
          formObj.creatorName = formCreator.firstName + " " + formCreator.lastName;
        }
        resObj.formList.push(formObj);
      }

      res.json(resObj);

    } else {
      throw new customError.FormNotFoundError("no forms exist");
    }
  } catch (err) {
    next(err);
  }
}

/**
 * Change the status of a form from
 * public to private or vice versa.
 */
// API 3.6 Controller
exports.changeFormStatus = async (req, res, next) => {
  let params = req.body;

  try {
    let reqForm = await Form.findOne({formId: params.formId});
    
    if (reqForm) {
      await reqForm.update({isPublic: params.isPublic});

      res.json({
        statusCode: 203,
        statusName: httpStatus.getName(203),
        message: "Status Change Successful!",
      })
    } else {
      // raise form not found error
      throw new customError.FormNotFoundError("invalid form id");
    }
    
  } catch (err) {
    next(err);
  }
}
/**
 * Fetches the checklist associated
 * with a submission. 
 */
// API 3.7 Controller
exports.fetchChecklist = async (req, res, next) => {
  let params = req.body;

  try {
    let reqSubmission = await Submission.findOne({submissionId: params.submissionId}, 'formId');
    if (!reqSubmission) throw new customError.SubmissionNotFoundError("invalid submissionId");

    let reqChecklists = await Checklist.find({formId: reqSubmission.formId}, 'checklistId sectionId description');
    let reqForm = await Form.findById(reqSubmission.formId, 'formId');

    let checklistList = [];

    for (let c of reqChecklists) {
      let checklistObj = helperFuncs.duplicateObject(c, ["checklistId", "sectionId", "description"]);
      checklistList.push(checklistObj);
    }

    res.json({
      statusCode: 200,
      statusName: httpStatus.getName(200),
      message: "Checklist Successfully Fetched!",
      formId: reqForm.formId,
      checklists: checklistList
    })
  } catch (err) {
    next(err);
  }
}