'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Modules:
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Services:
var mongoose = require('./services/mongoose');

// Routes:
var authRouter = require('./routes/auth.route')

// Others:
var { errorHandler } = require('./errors/errorhandler');

/*
  ------------------ CODE BODY --------------------
*/

/*
  <BLOCK EXPLAINATION>
  Creates app object and adds routes and dependancies to it.
  Then connects with database and exports app.
*/

// Variables:
let app = express();

// Add Dependencies To App:
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Add Routes To App:
app.use('/api/auth', authRouter);

// Add Error Handler
app.use(errorHandler());

// Connect With Mongoose
mongoose.connect();

// Export App
module.exports = app;