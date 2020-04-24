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

// CCA Schema:
const ccaSchema = new Schema({
  id: {
    type: Number,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  picture: {
    type: String
  },
  // Permissions to be changed:
  permissions: {
    type: String,
    required: true
  }
})

// Export CCA Schema
module.exports = mongoose.model('CCA', ccaSchema)