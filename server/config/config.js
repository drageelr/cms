'use strict'

/*
  ------------------ CODE BODY --------------------
*/

/*
  <<<<< EXPORT VARIABLES >>>>>
*/

// Configuration variables:
exports.variables = {
  secretKey: 'cde877eb09288700d5686608f6a8922d554f3ef8acd29500b8185eb97edcc2cf',
  port: '3030',
  db: 'cms-dev',
  mongoURI: 'mongodb://localhost:27017/',
  serverURL: 'http://167.71.224.73/',
  fileSavePath: '/home/zoraizq/CMS_Uploads/'
}

/*
  <<<<< EXPORT FUNCTIONS >>>>>
*/

/**
 * Sets variables.db to provided value.
 * @param {string} dbName - Name of the db to use.
 */
exports.setDB = (dbName) => {
  this.variables.db = dbName;
}