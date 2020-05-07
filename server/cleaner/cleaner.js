'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Modules:
var fs = require('fs');

// Services:
var mongoose = require('../services/mongoose');

// Models:
var File = require('../models/file.model');

// Others:
var { fileSavePath } = require('../config/config').variables;

/*
  ------------------ CODE BODY --------------------
*/

mongoose.connect();

async function cleanTrash () {
  console.log("Clean Trash!");
  try {
    let files = await File.find({saved: false});

    for (let f of files) {
      console.log(f);
      fs.unlinkSync(fileSavePath + f.name);
      await File.findByIdAndDelete(f._id);
    }
  } catch (err) {
    console.log(err);
  }
}

setInterval(cleanTrash, 1800000) // 30 mins in milliseconds