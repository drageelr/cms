'use strict'

/*
  ------------------ CODE BODY --------------------
*/

/*
  <<<<< EXPORT VARIABLES >>>>>
*/

// Configuration variables:
exports.instance = {
  branchName: "master",
  dbName: "prod"
}

/*
  <<<<< EXPORT FUNCTIONS >>>>>
*/

/**
* Sets instance.dbName to provided value.
* @param {string} name - Name of the db to use.
*/
exports.setDB = (name) => {
  this.instance.dbName = name;
}

/**
* Sets instance.branchName to provided value.
* @param {string} name - Name of the branch to pull and deploy.
*/
exports.setBranch = (name) => {
  this.instance.branchName = name;
}