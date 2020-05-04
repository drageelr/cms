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

// Sub Task Schema:
const subTaskSchema = new Schema({
  subtaskId: {
    type: Number,
    required: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ReqTask"
  },
  assigneeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CCA"
  },
  description: {
    type: String,
    required: true
  },
  check: {
    type: Boolean,
    required: true
  }
});

// Attach autoIncrement Plugin
subTaskSchema.plugin(autoIncrement, {model: 'SubTask', field: 'subtaskId', startAt: 1, incrementBy: 1});

// Export CCA Schema
module.exports = mongoose.model('SubTask', subTaskSchema)