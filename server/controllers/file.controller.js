'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Modules:
var fs = require('fs-extra');


// Models:
var File = require('../models/file.model');
var Submission = require('../models/submission.model');
var Form = require('../models/form.model');
var Society = require('../models/society.model');

// Services:
var httpStatus = require('../services/http-status');
var jwt = require('../services/jwt');

// Others:
var customError = require('../errors/errors');
var helperFuncs = require('../services/helper-funcs');
var { fileSavePath } = require('../config/config').variables;

/*
  ------------------ CODE BODY --------------------
*/

/*
  <<<<< EXPORT FUNCTIONS >>>>>
*/

exports.uploadFile = async (req, res, next) => {
  try {
    
    let fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', (fieldname, file, filename) => {

      let fileNameFinal = Date.now() + "-" + filename;

      fstream = fs.createWriteStream(fileSavePath + fileNameFinal);
      file.pipe(fstream);

      fstream.on('close', async () => {
        let reqFile = new File({
          name: fileNameFinal,
          saved: false
        });

        await reqFile.save();
        
        let fileToken = jwt.signFile(reqFile._id);

        res.json({
          statusCode: 201,
          statusName: httpStatus.getName(201),
          message: "File Uploaded Sucessfully!",
          fileToken: fileToken
        })
      });
    });

  } catch (err) {
    next(err);
  }
}

exports.downloadFile = async (req, res, next) => {
  let params = req.body;

  try {
    let reqSubmission = await Submission.findOne({submissionId: params.submissionId}, 'societyId formId itemsData');
    if (!reqSubmission) throw new customError.SubmissionNotFoundError("invalid submissionId");

    if (params.userObj.type != "cca" && params.userObj._id != reqSubmission.societyId) throw new customError.ForbiddenAccessError("user doesnot have access to this resource")

    let reqForm = await Form.findById(reqSubmission.formId, 'items');
    let itemExists = false;
    for (let i of reqForm.items) {
      if (i.itemId == params.itemId && i.type == "file") {
        itemExists = true;
        break;
      }
    }
    if (!itemExists) throw new customError.FileNotFoundError("item is not of type 'file'");

    let fileName = false;
    for (let i of reqSubmission.itemsData) {
      if (i.itemId == params.itemId) {
        fileName = i.data;
        break;
      }
    }
    if (!fileName) throw new customError.FileNotFoundError("item is not submitted");

    res.sendFile(fileSavePath + fileName);

  } catch (err) {
    next(err);
  }
}