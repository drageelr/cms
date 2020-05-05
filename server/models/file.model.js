'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Modules:
var mongoose = require('mongoose');

// Others:
const Schema = mongoose.Schema

/*
  ------------------ CODE BODY --------------------
*/

// File Schema:
const fileSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    required: true
  }
});

// Export File Schema
module.exports = mongoose.model('File', fileSchema)