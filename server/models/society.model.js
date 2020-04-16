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

// Society Schema:
const societySchema = new Schema({
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
  name: {
    type: String,
    required: true
  },
  nameInitials: {
    type: String,
    required: true
  },
  presidentEmail: {
    type: String,
    required: true
  },
  patronEmail: {
    type: String,
    required: true
  }
})

// Export Society Schema
module.exports = mongoose.model('Society', societySchema)