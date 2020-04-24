'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Modules:
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Routes:
var deployRouter = require('./routes/deploy.route');

/*
  ------------------ CODE BODY --------------------
*/

/*
  <BLOCK EXPLAINATION>
  Creates app object and adds routes and dependancies to it and exports app.
*/

// Variables:
let app = express();

// Add Dependencies To App:
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Allow access to files
app.use('/dev/site', express.static('./public'));

// Add Routes To App:
app.use('/dev/api', deployRouter);

// Export App
module.exports = app;