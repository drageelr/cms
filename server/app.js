'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Modules:
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var busboy = require('connect-busboy');

// Services:
var mongoose = require('./services/mongoose');

// Routes:
var authRouter = require('./routes/auth.route')
var accountRouter = require('./routes/account.route');
var formRouter = require('./routes/form.route');
var submissionRouter = require('./routes/submission.route');
var taskRouter = require('./routes/task.route');
var fileRouter = require('./routes/file.route');

// Others:
var { errorHandler } = require('./errors/errorhandler');
var { defaultCredentails } = require('./services/credentials');

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
app.use(busboy());

// Add Routes To App:
app.use('/api/auth', authRouter);
app.use('/api/account', accountRouter);
app.use('/api/form', formRouter);
app.use('/api/submission', submissionRouter);
app.use('/api/task-manager', taskRouter);
app.use('/api/file', fileRouter);

// Add Error Handler
app.use(errorHandler);

// Connect With Mongoose
mongoose.connect();

// Make Default Credentials:
defaultCredentails();

// Export App
module.exports = app;