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

// Conditional Item Schema:
const conditionalItemSchema = new Schema({
  optionId: {
    type: Number,
    required: true
  },
  itemIds: [{
    type: Number,
  }]
});

// Option Schema:
const optionSchema = new Schema({
  optionId: {
    type: Number,
    required: true
  },
  data: {
    type: String,
    required: true
  }
});

// Item Schema:
const itemSchema = new Schema({
  itemId: {
    type: Number,
    required: true
  },
  /**
  * type can be:
  * "textbox", "textlabel",
  * "dropdown", "checkbox",
  * "radio", "file"
  */
  type: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    required: true
  },
  defaultVisibility: {
    type: Boolean,
    required: true
  },
  placeHolder: {
    type: String
  },
  maxLength: {
    type: Number
  },
  options: [
    optionSchema
  ],
  conditionalItems: [
    conditionalItemSchema
  ],
  fileTypes: {
    type: String
  }
});

// Component Schema:
const componentSchema = new Schema({
  componentId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  itemsOrder: [{
    type: Number
  }]
});

// Section Schema:
const sectionSchema = new Schema({
  sectionId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  componentsOrder: [{
    type: Number,
  }]
});

// Form Schema:
const formSchema = new Schema({
  formId: {
    type: Number,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CCA'
  },
  title: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    required: true
  },
  sections: [
    sectionSchema
  ],
  components: [
    componentSchema
  ],
  items: [
    itemSchema
  ]
}, {
  timestamps: true
});

// Attach autoIncrement Plugin
formSchema.plugin(autoIncrement, {model: 'Form', field: 'formId', startAt: 1, incrementBy: 1});

// Export CCA Schema
module.exports = mongoose.model('Form', formSchema)