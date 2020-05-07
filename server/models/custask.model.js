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
const cusTaskSchema = new Schema({
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
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CCA"
  },
  statusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Status"
  },
  logIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Log"
  }],
  archive: {
    type: Boolean,
    required: true
  }
}, { timestamps: true });

// Attach autoIncrement Plugin
cusTaskSchema.plugin(autoIncrement, {model: 'CusTask', field: 'taskId', startAt: 1, incrementBy: 1});

// Export CCA Schema
module.exports = mongoose.model('CusTask', cusTaskSchema)