'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Models:
var Submission = require('../models/submission.model');
var Form = require('../models/form.model');
var Society = require('../models/society.model');
var File = require('../models/file.model');

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
const itemDataTypes = {
  textbox: "string",
  dropdown: "number",
  radio: "number",
  checkbox: "boolean",
  file: "string"
};

const submissionStatus = {
  pres: ["Issue(President)", "Pending(Patron)"],
  pat: ["Issue(Patron)", "Approved(Patron)"],
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

async function itemTypeValidation (formItems, itemsData) {
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
        // const nameSplitArr = i.data.split('.') //to get extension of file in last index
        // if (!fileTypesArr.includes('.' + nameSplitArr[nameSplitArr.length - 1])){
        //   return "item with id " + i.itemId + " does not support this file type, file types allowed: " + formitemTypeObj[i.itemId].fileTypes;
        // }
        let fileObj = jwt.decodeTokenFunc(i.data);
        let itemFile = await File.findById(fileObj._id);

        if (!itemFile) return "item with id " + i.itemId + " has not been uploaded";
        if (!itemFile.saved) return "item with id " + i.itemId + " was already used";
        if (itemFile.formId) return "item with id " + i.itemId + " was unlinked, can't use it again";
        
        const nameSplitArr = itemFile.name.split('.') //to get extension of file in last index
        if (!fileTypesArr.includes('.' + nameSplitArr[nameSplitArr.length - 1])) {
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

function validateStatus (statusList) {
  if (statusList.length < 1 || statusList.length > 6) {
    return "too many statuses given"
  }

  const statusApplicable = ["Approved(Patron)", "Pending(CCA)", "Issue(CCA)", "Approved(CCA)", "Write-Up", "Completed"];
  let statusChecked = [];
  for (let s of statusList) {
    let sIndexA = statusApplicable.indexOf(s);
    let sIndexC = statusChecked.indexOf(s);
    if (sIndexA < 0 || sIndexC > -1) {
      return "status " + s + " is either invalid or included multiple times";
    } else {
      statusChecked.push(s);
    }
  }

  return false;
}

function autoStatusUpdate (currentStatus) {
  const nextStatus = {
    "Issue(President)": {status: "Pending(President)", email: "presidentEmail", type: "pres"},
    "Issue(Patron)": {status: "Pending(Patron)", email: "patronEmail", type: "pat"},
  };

  return nextStatus[currentStatus];
}

function sendReviewEmail (recipientEmail, accountType, societyInitials, submissionId, societyId) {
  let token = jwt.signSubmission(societyId, submissionId, accountType);
  let link = "" + config.serverURL + "review/" + accountType + "?token=" + token;
  nodemailer.sendSubmissionReview(recipientEmail, link, societyInitials);
}

function sendIssueEmail (recipientEmail, issue, submissionIdNumeric, issuerType, issuerEmail) {
  const issuerName = {pat: "Patron", pres: "President"}
  let body = "An issue has been identified by the " + issuerName[issuerType] + " (email: " + issuerEmail + ") " + " of your society in Submission " + submissionIdNumeric + ". Kindly recitfy the issue by attaching notes to the submission or editing the fields previously unfilled!. <br /> <b>Issue:<b/>" + issue;
  nodemailer.sendIssueEmail(recipientEmail, body);
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
        let submissionValidationError = false;

        // 1) Check item ids are correct or not! (Match itemIds in form + Check for duplicate ids)
        submissionValidationError = itemIdValidation(reqForm.items, itemsData);
        if (submissionValidationError) throw new customError.SubmissionValidationError(submissionValidationError);

        // 2) Check item constraints based on types + form data
        submissionValidationError = await itemTypeValidation(reqForm.items, itemsData);
        if (submissionValidationError) throw new customError.SubmissionValidationError(submissionValidationError);

        // 3) Check re-entry of an item is not given
        submissionValidationError = duplicateEntryValidation(reqSubmission, itemsData);
        if (submissionValidationError) throw new customError.SubmissionValidationError(submissionValidationError);

        // 4) For "File" types, get correct data:
        for(let iS of itemsData) {
          for (let iF of reqForm.items) {
            if (iS.itemId == iF.itemId && iF.type == "file") {
              let reqFile = await File.findByIdAndUpdate(jwt.decodeTokenFunc(iS.data)._id, {saved: true, formId: reqForm._id});
              iS.data = reqFile.name;
            }
          }
        }

        let resubmissionQuery = {$push: {itemsData}};

        let statusToUpdateObj = autoStatusUpdate(reqSubmission.status);

        if(statusToUpdateObj) {
          resubmissionQuery.$set = {status: statusToUpdateObj.status};
        }
        
        await reqSubmission.update(resubmissionQuery);

        if (statusToUpdateObj) {
          let reqSociety = await Society.findById(params.userObj._id, statusToUpdateObj.email);
          sendReviewEmail(reqSociety[statusToUpdateObj.email], reqSociety[statusToUpdateObj].type, reqSociety.nameInitials, reqSubmission._id, reqSociety._id);
        }

      
        res.json({
          status: httpStatus.getName(200),
          statusCode: 200,
          message: "Submission Successful!",
          timestampCreated: reqSubmission.createdAt,
          timestampModified: reqSubmission.updatedAt
        });
      } else if (!submissionId) {
        // new submission -> Normal validation
        let submissionValidationError = false;
        
        // 1) Check item ids are correct or not! (Match itemIds in form + Check for duplicate ids) + 3) Check All required are given in this or not
        submissionValidationError = itemIdValidation(reqForm.items, itemsData, true);
        if (submissionValidationError) throw new customError.SubmissionValidationError(submissionValidationError);

        // 2) Check item constraints basonsed on types + form data
        submissionValidationError = await itemTypeValidation(reqForm.items, itemsData);
        if (submissionValidationError) throw new customError.SubmissionValidationError(submissionValidationError);

        // 4) For "File" types, get correct data:
        for(let iS of itemsData) {
          for (let iF of reqForm.items) {
            if (iS.itemId == iF.itemId && iF.type == "file") {
              let reqFile = await File.findByIdAndUpdate(jwt.decodeTokenFunc(iS.data)._id, {saved: true, formId: reqForm._id});
              iS.data = reqFile.name;
            }
          }
        }

        let newSubmission = new Submission({
          formId: reqForm._id,
          societyId: params.userObj._id,
          status: "Pending(President)",
          itemsData: itemsData
        });
        await newSubmission.save();

        let reqSociety = await Society.findById(params.userObj._id, 'presidentEmail _id nameInitials');

        sendReviewEmail(reqSociety.presidentEmail, "pres", reqSociety.nameInitials, newSubmission._id, reqSociety._id);

        res.json({
          status: httpStatus.getName(200),
          statusCode: 200,
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
    let reqQuery = {};
    
    if (params.userObj.type == "soc") {
      reqQuery.societyId = params.userObj._id;
      reqQuery.status = { $ne: "Completed" }
    } else if (params.userObj.type == "cca") {
      
      if (params.statusList) {
        let statusValidationError = validateStatus(params.statusList);

        if (!statusValidationError) {
          reqQuery.status = {$in: params.statusList};
        }
      }

      if (params.timeObj) {
        reqQuery.createdAt = {$gte: new Date(params.timeObj.dateStart), $lte: new Date(params.timeObj.dateEnd)};
      }
    }

    let reqSubmissions = await Submission.find(reqQuery);

    if (reqSubmissions.length) {
      let submissionsList = [];
      for (let s of reqSubmissions) {
        let reqSociety = await Society.findById(s.societyId, 'nameInitials name');
        let reqForm = await Form.findById(s.formId, 'title formId');
        
        submissionsList.push({
          submissionId: s.submissionId,
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
      throw new customError.SubmissionNotFoundError("no matching submission found");
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
      if (!(statusAvailable.includes(params.status))) {
        throw new customError.SubmissionValidationError("invalid status or status not allowed, allowed statuses are: " + JSON.stringify(statusAvailable));
      }
      // params.status contains the string "Issue"
      if (params.status.includes("Issue") && params.issue && params.userObj.type != "cca"){
        let reqSociety = await Society.findById(params.userObj._id, 'patronEmail presidentEmail email');
        let emailAddr = reqSociety.presidentEmail;
        if (params.userObj.type == "pat") {
          emailAddr = reqSociety.patronEmail;
        }
        sendIssueEmail(reqSociety.email, params.issue, reqSubmission.submissionId, params.userObj.type, emailAddr);
      } else if (params.status == "Pending(Patron)" && params.userObj.type != "cca") {
        let reqSociety = await Society.findById(params.userObj._id, 'patronEmail _id nameInitials');
        sendReviewEmail(reqSociety.patronEmail, "pat", reqSociety.nameInitials, reqSubmission._id, reqSociety._id);
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
      let reqForm = await Form.findById(reqSubmission.formId, 'formId');
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
        formId: reqForm.formId
      });
    } else {
      // raise submission not found error
      throw new customError.SubmissionNotFoundError("invalid submission id");
    }
  } catch (err) {
    next(err);
  }
}