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

// Request Task Schema:
const reqTaskSchema = new Schema({
  taskId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Submission",
    unique: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CCA"
  },
  statusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Status"
  },
  subtaskIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubTask"
  }],
  logIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Log"
  }],
  archive: {
    type: Boolean,
    required: true
  }
}, { timestamps });

// Attach autoIncrement Plugin
reqTaskSchema.plugin(autoIncrement, {model: 'ReqTask', field: 'taskId', startAt: 1, incrementBy: 1});

// Export CCA Schema
module.exports = mongoose.model('ReqTask', reqTaskSchema)