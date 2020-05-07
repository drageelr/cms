'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Models:
var CCA = require('../models/cca.model');

// Services:
var httpStatus = require('../services/http-status');

// Others:
var customError = require('../errors/errors');

/*
  ------------------ CODE BODY --------------------
*/

/*
  <<<<< EXPORT FUNCTIONS >>>>>
*/

/**
 * Default credentials for the Admin account.
 */
exports.defaultCredentails = async () => {
  try {
    let anyCCA = await CCA.findOne({}, 'ccaId');

    if (!anyCCA) {
      anyCCA = new CCA({
        firstName: "Admin",
        lastName: "Test",
        email: "admin@lums.edu.pk",
        password: "Test12345",
        picture: "none",
        permissions: {
          societyCRUD: true,
          ccaCRUD: true,
          accessFormMaker: true,
          createReqTask: true,
          createCustomTask: true,
          createTaskStatus: true,
          archiveTask: true,
          unarchiveTask: true,
          setFormStatus: true,
          addCCANote: true
        },
        active: true,
        role: "admin",
        themeColor: "#3578fa",
        darkMode: false
      });

      await anyCCA.save();

      console.log("email: admin@lums.edu.pk");
      console.log("password: Test12345");
    }
  } catch (err) {
    console.log(err);
  }
}