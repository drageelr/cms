'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Modules:
var nodemailer = require('nodemailer');

// Resources:
var emailTemplate = require('../resources/email-template');

/*
  ------------------ CODE BODY --------------------
*/

// Varaibles:
let emailer = nodemailer.createTransport({
service: 'gmail',
auth: {
    user: 'cmslums@gmail.com',
    pass: '@.CMSrocks99.@'
}
});

/*
  <<<<< HELPER FUNCTIONS >>>>>
*/

function sendEmail (mailOptions) {
  try {

    emailer.sendMail(mailOptions, function(err , info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent to \"" + emailTarget + "\" " + info.response);
      }
    });

  } catch (err) {
    console.log(err);
  }
}

/*
  <<<<< EXPORT FUNCTIONS >>>>>
*/

exports.sendSubmissionReview = (emailTarget, link, societyInitials) => {
  try {
    let title = "Review " + societyInitials + "'s Submission";
    let body = "Kindly review " + societyInitials + "'s submission and mark it as APPROVED or ISSUE via the following link." ;
    let linkText = "View Submission"

    let mailOptions = {
      from: 'CMS <cmslums@gmail.com>',
      to: emailTarget,
      subject: 'Review Submission',
      html: emailTemplate.generatetemplateA(title, body, link, linkText)
    };

    sendEmail(mailOptions);
  } catch (err) {
    console.log(err);
  }
}

exports.sendIssueEmail = (emailTarget, body) => {
  try {
    let title = "Submission Issue";
    
    let mailOptions = {
      from: 'CMS <cmslums@gmail.com>',
      to: emailTarget,
      subject: 'Submission Issue',
      html: emailTemplate.generatetemplateA(title, body, "", "")
    };

    sendEmail(mailOptions);
  } catch (err) {
    console.log(err);
  }
}