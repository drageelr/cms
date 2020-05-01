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

// Checklist Schema
const checklistSchema = new Schema({
  checklistId: {
    type: Number,
  },
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form'
  },
  sectionId: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
})

// Attach autoIncrement Plugin
checklistSchema.plugin(autoIncrement, {model: 'Checklist', field: 'checklistId', startAt: 1, incrementBy: 1});

// Export CCA Schema
module.exports = mongoose.model('Checklist', checklistSchema)