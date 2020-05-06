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
const statusSchema = new Schema({
  statusId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  }
});

// Attach autoIncrement Plugin
statusSchema.plugin(autoIncrement, {model: 'Status', field: 'statusId', startAt: 1, incrementBy: 1});

// Export CCA Schema
module.exports = mongoose.model('Status', statusSchema)