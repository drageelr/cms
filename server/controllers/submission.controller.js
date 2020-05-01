'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Models:
var Submission = require('../models/submission.model');
var Form = require('../models/form.model');
var Society = require('../models/society.model');

// Services:
var httpStatus = require('../services/http-status');

// Others:
var customError = require('../errors/errors');
var helperFuncs = require('../services/helper-funcs');

/*
  ------------------ CODE BODY --------------------
*/
// Constants:
const itemDataTypes = {
  textbox: "string",
  dropdown: "number",
  radio: "number",
  checkbox: "boolean",
  file: "string"
};

const submissionStatus = {
  pres: ["Pending(President)", "Issue(President)"],
  pat: ["Pending(Patron)", "Issue(Patron)", "Approved(Patron)"],
  cca: ["Pending(CCA)", "Issue(CCA)", "Approved(CCA)",  "Write-Up",  "Completed"],
}

/*
  <<<<< HELPER FUNCTIONS >>>>>
*/

function itemIdValidation (formItems, itemsData, requiredCheck = false) {
  // Validate Item Ids Uniqueness 
  let itemIds = [];
  let formItemIds = helperFuncs.createObjFromObjArr(formItems, "itemId", "required");
  for (let i of itemsData) {
    let iIdIndex = itemIds.indexOf(i.itemId);
    if (iIdIndex < 0) {
      itemIds.push(i.itemId);

      // Validate Item Id Existence 
      if (i.itemId in formItemIds) {
        delete formItemIds[i.itemId]; //delete object['property']
      } else {
        return "item with id " + i.itemId + " does not exist in form";
      }
    } else {
      return "item ids not unqiue";
    }
  }

  // Validate All Required Ones Are Filled
  // if (requiredCheck) {
  //   for (let iObj in formItemIds) {
  //     if (iObj.required == true) {
  //       return "all required objects are not filled";
  //     }
  //   }
  // }

  return false;
}

function itemTypeValidation (formItems, itemsData) {
  let formitemTypeObj = helperFuncs.createObjFromObjArr(formItems, "itemId", ["type", "maxLength", "options", "fileTypes"]);
  for (let i of itemsData) {
    // Data Type Validation
    let correctDataType = itemDataTypes[formitemTypeObj[i.itemId].type]
    if (correctDataType === undefined) {
      return "item with id " + i.itemId + " type does not exist OR type does not take any input";
    } else if (typeof i.data != correctDataType) {
      return "item with id " + i.itemId + " has invalid data type, should be: " + correctDataType;
    }

    // Data Value Validation
    switch(correctDataType) {
      case "textbox":
        let maxLength = formitemTypeObj[i.itemId].maxLength;
        if (i.data.length > maxLength){
          return "textbox with id " + i.itemId + " has exceeded the max length allowed: " + maxLength;
        } 
        break
      case "radio": case "dropdown":
        let options = helperFuncs.createArrFromObjArr(formitemTypeObj[i.itemId].options, "optionId");
        if (!options.includes(i.data)) {
          return "item with id " + i.itemId + " has no such value in its options: " + options;
        }
        break
      case "file":
        const fileTypesArr = formitemTypeObj[i.itemId].fileTypes.split(',');
        const nameSplitArr = i.data.split('.') //to get extension of file in last index
        if (!fileTypesArr.includes('.' + nameSplitArr[nameSplitArr.length - 1])){
          return "item with id " + i.itemId + " does not support this file type, file types allowed: " + formitemTypeObj[i.itemId].fileTypes;
        }
        break
    }
  }

  return false;
}

function duplicateEntryValidation (reqSubmission, itemsData) {
  let submissionItemIds = helperFuncs.createArrFromObjArr(reqSubmission.itemsData, "itemId");
  for (let i in itemsData) {
    if (i.itemId in submissionItemIds) {
      return "item with id " + i.itemId + " already has a value";
    }
  }

  return false;
}

/*
  <<<<< EXPORT FUNCTIONS >>>>>
*/

exports.submitForm = async (req, res, next) => {
  let params = req.body;
  let formId = params.formId;
  let submissionId = params.submissionId
  let itemsData = params.itemsData;

  try {
    let reqForm = await Form.findOne({formId: formId});

    if (reqForm) {
      let reqSubmission = await Submission.findOne({submissionId: submissionId});

      if (reqSubmission) {
        // existing submission -> different validation

        // 1) Check item ids are correct or not! (Match itemIds in form + Check for duplicate ids)
        submissionValidationError = itemIdValidation(reqForm.items, itemsData);
        if (submissionValidationError) throw new customError.SubmissionValidationError(submissionValidationError);

        // 2) Check item constraints based on types + form data
        submissionValidationError = itemTypeValidation(reqForm.items, itemsData);
        if (submissionValidationError) throw new customError.SubmissionValidationError(submissionValidationError);

        // 3) Check re-entry of an item is not given
        submissionValidationError = duplicateEntryValidation(reqSubmission, itemsData);
        if (submissionValidationError) throw new customError.SubmissionValidationError(submissionValidationError);

        await reqSubmission.update({$push: {itemsData}});
      
        res.json({
          status: 200,
          statusCode: httpStatus.getName(200),
          message: "Submission Successful!",
          timestampCreated: newSubmission.createdAt,
          timestampModified: newSubmission.updatedAt
        });
      } else if (!submissionId) {
        // new submission -> Normal validation
        let submissionValidationError = false;

        // 1) Check item ids are correct or not! (Match itemIds in form + Check for duplicate ids) + 3) Check All required are given in this or not
        submissionValidationError = itemIdValidation(reqForm.items, itemsData, true);
        if (submissionValidationError) throw new customError.SubmissionValidationError(submissionValidationError);

        // 2) Check item constraints basonsed on types + form data
        submissionValidationError = itemTypeValidation(reqForm.items, itemsData);
        if (submissionValidationError) throw new customError.SubmissionValidationError(submissionValidationError);

        let newSubmission = new Submission({
          formId: reqForm._id,
          societyId: params.userObj._id,
          status: "Pending(President)",
          itemsData: params.itemsData
        });
        await newSubmission.save();

        res.json({
          status: 200,
          statusCode: httpStatus.getName(200),
          message: "Submission Successful!",
          submissionId: newSubmission.submissionId,
          timestampCreated: newSubmission.createdAt,
          timestampModified: newSubmission.updatedAt
        })
      } else {
        // raise submission not found error
        throw new customError.SubmissionNotFoundError("invalid submission id");
      }
    } else {
      // raise form not found error
      throw new customError.FormNotFoundError("invalid form id");
    }
  } catch (err) {
    next(err);
  }
}

exports.addCCANote = async (req, res, next) => {
  let params = req.body;
  
  try {
    let reqSubmission = await Submission.findOne({submissionId: params.submissionId}, 'submissionId');

    if (reqSubmission) {
      // Save cca note to db here
      await reqSubmission.update({$push: {ccaNotes: {note: params.note}}});

      res.json({
        statusCode: 203,
        statusName: httpStatus.getName(203),
        message: "CCA Note Successfully Added!"
      });
    } else {
      // throw submission not found error
      throw new customError.SubmissionNotFoundError("invalid submission id");
    }
  }
  catch (err) {
    next(err);
  }
}

exports.addSocietyNote = async (req, res, next) => {
  let params = req.body;
  
  try {
    let reqSubmission = await Submission.findOne({submissionId: params.submissionId}, 'submissionId');

    if (reqSubmission) {
      // Save society note to db here
      await reqSubmission.update({$push: {societyNotes: {note: params.note}}});

      res.json({
        statusCode: 203,
        statusName: httpStatus.getName(203),
        message: "Society Note Successfully Added!"
      });
    } else {
      // throw submission not found error
      throw new customError.SubmissionNotFoundError("invalid submission id");
    }
  }
  catch (err) {
    next(err);
  }
}


exports.getSubmissionList = async (req, res, next) => {
  let params = req.body;

  try {
    let reqQuery = {status: { $ne: "Completed" }};
    
    if (params.userObj.type == "soc") {
      reqQuery.societyId = params.userObj._id;
    } else if (params.userObj.type == "cca" && params.showCompleted) {
      delete reqQuery["status"];
    }

    let reqSubmissions = await Submission.find(reqQuery);

    if (reqSubmissions.length) {
      let submissionsList = [];
      for (let s of reqSubmissions) {
        let reqSociety = await Society.findById(s.societyId, 'nameInitials name');
        let reqForm = await Form.findById(s.formId, 'title formId');
        
        submissionsList.push({
          societyId: s.societyId,
          status: s.status,
          formId: reqForm.formId,
          formTitle: reqForm.title,
          societyName: reqSociety.name,
          societyNameInitials: reqSociety.nameInitials,
          timestampCreated: s.createdAt,
          timestampModified: s.updatedAt
        });
      }

      res.json({
        statusCode: 200,
        statusName: httpStatus.getName(200),
        message: "Submission List Successfully Fetched!",
        submissions: submissionsList
      });
    } else {
      // raise submission not found error
      throw new customError.SubmissionNotFoundError("invalid submission id");
    }
  } catch (err) {
    next(err);
  }
}

exports.updateSubmissionStatus = async (req, res, next) => {
  let params = req.body;

  try {
    let reqSubmission = await Submission.findOne({submissionId: params.submissionId});
    
    if (reqSubmission) {
      let statusAvailable = submissionStatus[params.userObj.type];
      if (!(params.status in statusAvailable)) throw new customError.SubmissionValidationError("invalid status or status not allowed");

      // params.status contains the string "Issue"
      if (params.status.includes("Issue") && params.issue && params.userObj.type != "cca"){
        // Email Issue
      }
      
      await reqSubmission.update({status: params.status});
    
      res.json({
        statusCode: 203,
        statusName: httpStatus.getName(203),
        message: "Status Update Successful!"
      });
    } else {
      // raise submission not found error
      throw new customError.SubmissionNotFoundError("invalid submission id");
    }
    
  } catch (err) {
    next(err);
  }
}

exports.fetchSubmission = async (req, res, next) => {
  let params = req.body;

  try {
    let reqSubmission = await Submission.findOne({submissionId: params.submissionId});

    if (reqSubmission) {
      let itemsData = helperFuncs.createArrFromObjArr(reqSubmission.itemsData, ["itemId", "data"]);
      let societyNotes = [];
      let ccaNotes = [];
      
      for (let s of reqSubmission.societyNotes) {
        societyNotes.push({
          note: s.note,
          timestampCreated: s.createdAt
        });
      }

      for (let c of reqSubmission.ccaNotes) {
        ccaNotes.push({
          note: c.note,
          timestampCreated: c.createdAt
        });
      }

      res.json({
        statusCode: 200,
        statusName: httpStatus.getName(200),
        itemsData: itemsData,
        ccaNotes: ccaNotes,
        societyNotes: societyNotes,
      });
    } else {
      // raise submission not found error
      throw new customError.SubmissionNotFoundError("invalid submission id");
    }
  } catch (err) {
    next(err);
  }
}