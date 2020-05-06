'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Modules:
var mongoose = require('mongoose');
var { autoIncrement } = require('mongoose-plugin-autoinc');

// Others:
const Schema = mongoose.Schema

/*
  ------------------ CODE BODY --------------------
*/

// CCA Schema:
const permissionsSchema = new Schema({
  societyCRUD: {
    type: Boolean,
    required: true
  },
  ccaCRUD: {
    type: Boolean,
    required: true
  },
  accessFormMaker: {
    type: Boolean,
    required: true
  },
  createReqTask: {
    type: Boolean,
    required: true
  },
  createCustomTask: {
    type: Boolean,
    required: true
  },
  createTaskStatus: {
    type: Boolean,
    required: true
  },
  archiveTask: {
    type: Boolean,
    required: true
  },
  unarchiveTask: {
    type: Boolean,
    required: true
  },
  setFormStatus: {
    type: Boolean,
    required: true
  },
  addCCANote: {
    type: Boolean,
    required: true
  }
})

const ccaSchema = new Schema({
  ccaId: {
    type: Number,
    // unique: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
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
  permissions: permissionsSchema,
  active: {
    type: Boolean,
    required: true
  },
  themeColor: {
    type: String,
    required: true
  },
  darkMode: {
    type: Boolean,
    required: true
  }
})

// Attach autoIncrement Plugin
ccaSchema.plugin(autoIncrement, {model: 'CCA', field: 'ccaId', startAt: 1, incrementBy: 1});

// Export CCA Schema
module.exports = mongoose.model('CCA', ccaSchema)