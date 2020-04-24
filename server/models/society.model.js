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

// Society Schema:
const societySchema = new Schema({
  societyId: {
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
  },
  active: {
    type: Boolean,
    required: true
  }
})

// Attach autoIncrement Plugin
societySchema.plugin(autoIncrement, {model: 'Society', field: 'societyId', startAt: 1, incrementBy: 1});

// Export Society Schema
module.exports = mongoose.model('Society', societySchema)