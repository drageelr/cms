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
  permissions: {
    type: {
      societyCRUD: { type: Boolean },
      ccaCRUD: { type: Boolean },
      accessFormMaker: { type: Boolean },
      createReqTask: { type: Boolean },
      createCustomTask: { type: Boolean },
      createTaskStatus: { type: Boolean },
      archiveTask: { type: Boolean },
      unarchiveTask: { type: Boolean },
      setFormStatus: { type: Boolean },
      addCCANote: { type: Boolean }
    }
  }
})

// Attach autoIncrement Plugin
ccaSchema.plugin(autoIncrement, {model: 'CCA', field: 'ccaId', startAt: 1, incrementBy: 1});

// Export CCA Schema
module.exports = mongoose.model('CCA', ccaSchema)