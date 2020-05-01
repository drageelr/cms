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

// CCA Note Schema
const ccaNoteSchema = new Schema({
  note: {
    type: String,
    required: true
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, { timestamps: true });

// Society Note Schema
const societyNoteSchema = new Schema({
  note: {
    type: String,
    required: true
  }
}, { timestamps : true });

// Item Data Schema
const itemDataSchema = new Schema({
  itemId: {
    type: Number,
    required: true
  },
  data: {

  }
});

// Submission Schema
const submissionSchema = new Schema({
  submissionId: {
    type: Number,
  },
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form'
  },
  societyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Society"
  },
  /**
   * "Pending(President)", "Issue(President)",
   * "Pending(Patron)", "Issue(Patron)", "Approved(Patron)"
   * "Pending(CCA)", "Issue(CCA)", "Approved(CCA)",  "Write-Up",  "Completed"
   */
  status: {
    type: String,
    required: true
  },
  ccaNotes: [
    ccaNoteSchema
  ],
  societyNotes: [
    societyNoteSchema
  ],
  itemsData: [
    itemDataSchema
  ]
}, { timestamps: true });


// Attach autoIncrement Plugin
submissionSchema.plugin(autoIncrement, {model: 'Submission', field: 'submissionId', startAt: 1, incrementBy: 1});

// Export CCA Schema
module.exports = mongoose.model('Submission', submissionSchema);