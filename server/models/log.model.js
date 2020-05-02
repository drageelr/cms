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

// Log Schema:
const logSchema = new Schema({
  logId: {
    type: Number,
    required: true
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CCA"
  },
  description: {
    type: String,
    required: true
  },
}, { timestamps });

// Attach autoIncrement Plugin
logSchema.plugin(autoIncrement, {model: 'Log', field: 'logId', startAt: 1, incrementBy: 1});

// Export CCA Schema
module.exports = mongoose.model('Log', logSchema)