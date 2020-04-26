'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Models:
var Society = require('../models/society.model');
var CCA = require('../models/cca.model');
var Form = require('../models/form.model');
var Checklist = require('../models/checklist.model');

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
  if (itemKeys !== itemTypes[item.type]) {
    return "item with id " + item.itemId + " should have only these key in the defined order: " + JSON.stringify(itemTypes[item.type]);
  }
  
  // Check For Duplicate Option Ids:
  if (item.options) {
    let options = item.options;
    let optionIds = [];
    for (let o in options) {
      let oIdIndex = optionIds.indexOf(o.optionId);
      if (oIdIndex > -1) {
        optionIds.push(o.optionId);
      } else {
        return "item with id " + item.itemId + " has non unqiue option ids";
      }
    }
    // Conitional Items missing here!
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
      if(!itemKeyError) { return itemKeyError }
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
      if (index < 0) { return "checklist references a non existent section with id " + toString(c.sectionId) }
    }
  }

  return false;
}

/*
  <<<<< EXPORT FUNCTIONS >>>>>
*/

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
      throw new customError.FormValdiationError(formValidationError);
    }
  } catch (err) {
    next(err);
  }
}

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

          await Checklist.deleteMany({checklistId: {$in: checklistIds}});
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
        throw new customError.FormValdiationError(formValidationError);
      }
    } else {
      // throw invalid form id error
      throw new customError.FormValdiationError("form does not exist");
    }
  } catch (err) {
    next(err);
  }
}

exports.deleteForm = async (req, res, next) => {
  res.json({
    statusCode: 501,
    statusName: httpStatus.getName(501),
    message: "Not yet implemented!"
  });
}

exports.fetchForm = async (req, res, next) => {
  let params = req.body;

  try {
    let reqForm = await Form.findOne({formId: params.formId});
    
    if (reqForm) {
      let creatorId = await CCA.findById(reqForm.creatorId, 'ccaId');

      let formObj = {
        id: reqForm.formId,
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
        formObj.items[i] = helperFuncs.duplicateObject(reqForm.items[i], ["itemId", "type", "label", "requried", "defaultVisibility", "placeHolder", "maxLength", "fileTypes"], true);
      
        if (reqForm.items[i].options) {
          formObj.items[i].options = [];
          for (let s of reqForm.items[i].options) {
            formObj.items[i].options.push(helperFuncs.duplicateObject(s, ["optionId", "data"]));
          }
        }

        if (reqForm.items[i].conditionalItems) {
          formObj.items[i].conditionalItems = [];
          for (let c of reqForm.items[i].conditionalItems) {
            formObj.items[i].conditionalItems.push(helperFuncs.duplicateObject(c, ["optionId", "itemId"]));
          }
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

  }
}